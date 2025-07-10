from flask import Flask, render_template, request, jsonify
import subprocess
import sys
import os

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')  


@app.route('/run', methods=['POST'])
def run_code():
    data = request.get_json()
    code = data.get('code')

    if not code:
        return jsonify({'output': 'No code provided.'}), 400

    try:
        
        result = subprocess.run(
            [sys.executable, "-c", code],
            capture_output=True,
            text=True,
            timeout=5
        )
        output = result.stdout if result.stdout else result.stderr
        return jsonify({'output': output})
    except subprocess.TimeoutExpired:
        return jsonify({'output': '⏳ Error: Code execution timed out.'})
    except Exception as e:
        return jsonify({'output': f'❌ Error: {str(e)}'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
