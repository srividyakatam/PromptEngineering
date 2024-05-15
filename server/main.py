from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins='*')

# @app.route("/api/users", methods=['GET'])
# def users():
#     return jsonify({"users": ['user1', 'user2', 'user3']})

@app.route("/chat", methods=['POST'])
def chat():
    data = request.get_json()
    print(data.get("messages"))
    messages = data.get("messages")
    training_prompt = {"role": "system", "content": "You are an expert at crafting effective prompts and train others to achieve the same. For each prompt given to you, analyze the prompt for clarity, specificity and any potential baises. If a prompt is biased, reject the prompt saying you do not support biased prompts. Give any useful guidance and tips for the users to improve."}
    messages.insert(0, training_prompt)

    try:
        from openai import OpenAI
        client = OpenAI(api_key = "your_api_key")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
                )
        return jsonify({'response': response.choices[0].message.content.strip()})
       
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)
