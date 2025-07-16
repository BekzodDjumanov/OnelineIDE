from flask import Flask, render_template, request, jsonify, redirect, url_for
import subprocess
import os
import uuid
import tempfile
import shutil

app = Flask(__name__)

@app.route('/')
def home():
    return redirect(url_for('python_ide'))

# serve Python IDE
@app.route('/python')
def python_ide():
    return render_template('index.html')

# serve Java IDE
@app.route('/java')
def java_ide():
    return render_template('java.html')

# universal runner for both
@app.route('/run', methods=['POST'])
def run_code():
    data = request.get_json()
    code = data.get('code')
    language = data.get('language', 'python')

    if not code:
        return jsonify({'output': 'No code provided.'}), 400

    if language == 'java':
        return run_java(code)
    else:
        return run_python(code)

def run_python(code):
    try:
        result = subprocess.run(
            ['python3', '-c', code],
            capture_output=True,
            text=True,
            timeout=5
        )
        return jsonify({'output': result.stdout or result.stderr})
    except subprocess.TimeoutExpired:
        return jsonify({'output': 'Execution timed out.'})
    except Exception as e:
        return jsonify({'output': f'Error: {str(e)}'}), 500

def run_java(code):
    try:
        temp_dir = tempfile.mkdtemp()
        filename = "Main"
        java_file = os.path.join(temp_dir, f"{filename}.java")

        # Write Java code to file
        with open(java_file, 'w') as f:
            f.write(code)

        # Compile Java code
        compile_proc = subprocess.run(
            ['javac', java_file],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd=temp_dir
        )

        if compile_proc.returncode != 0:
            shutil.rmtree(temp_dir)
            return jsonify({'output': compile_proc.stderr})

        # Run compiled Java class
        run_proc = subprocess.run(
            ['java', '-classpath', temp_dir, filename],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=3  # shorter timeout for faster failover
        )

        output = run_proc.stdout.strip() if run_proc.stdout else run_proc.stderr.strip()

        # Clean up
        shutil.rmtree(temp_dir)

        return jsonify({'output': output})

    except subprocess.TimeoutExpired:
        return jsonify({'output': 'Execution timed out.'}), 504

    except Exception as e:
        return jsonify({'output': f'Error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)