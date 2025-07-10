from flask import Flask, render_template, request, jsonify
import subprocess
import sys
import os

app = Flask(__name__)

# Route to serve the main HTML page
@app.route('/')
def index():
    return render_template('index.html')  # make sure your file is in templates/

# Route to run Python code
@app.route('/run', methods=['POST'])
def run_code():
    data = request.get_json()
    code = data.get('code')

    if not code:
        return jsonify({'output': 'No code provided.'}), 400

    try:
        # Run code using a subprocess
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

# Run the Flask server
if __name__ == '__main__':
    app.run(debug=True)
