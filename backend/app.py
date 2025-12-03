from flask import Flask, json, jsonify, redirect, request, url_for
import os

app = Flask(__name__)
DATA_FILE = os.path.join(os.path.dirname(__file__), "todo.json")

def read_tasks():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        return json.load(f)
    
def write_tasks(tasks):
    with open(DATA_FILE, "w") as f:
        json.dump(tasks, f, indent=2, ensure_ascii=False)

@app.route('/task', methods=['GET'])
def showTasks():
    tasks = read_tasks()
    return jsonify(tasks)

@app.route('/addtask', methods=['POST'])
def addTask():
    data = request.get_json(silent=True)
    if not data:
        data = request.form.to_dict()
    task = data.get("task")
    desc = data.get("desc")

    if not task or not desc:
        return jsonify({
            "success": False,
            "error": "task and desc required"
        }), 400

    newtask = {"task": task, "description": desc}
    tasks = read_tasks()
    tasks.append(newtask)
    write_tasks(tasks)

    return jsonify({"success": True, "item": newtask}), 201


if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0', debug=True)