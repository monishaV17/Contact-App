from flask import Flask,request,jsonify
import mysql.connector
import jwt
import datetime
from flask_cors import CORS
from dotenv import load_dotenv
import os
app=Flask(__name__)

CORS(app)

SECRET_KEY=os.getenv('SECRET_KEY')
blacklist=set()

db=mysql.connector.connect(host="localhost", user="root", password=os.getenv('MYSQL_PASSWORD'), database="contactdb")
cursor=db.cursor(dictionary=True)

def verify_token():
    auth_header=request.headers.get('Authorization')
    print("HEADER:", auth_header)
    if not auth_header:
        return None
    try:
        parts=auth_header.split(" ") 
        print("PARTS:", parts) 
        token=parts[1]
        print("TOKEN:", token)
        if token in blacklist:
            return None
        data=jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        print("DECODED:", data)
        return data['user_id']
    except Exception as e:
        print(f"Error: {str(e)}1")
        return None

@app.route('/signup', methods=['POST'])
def signup():
    data=request.get_json()
    if not data:
        return jsonify({"error": "No JSON data received"}),400
    name=data.get('name')
    email=data.get('email')
    password=data.get('password')
    try:
        cursor.execute("SELECT * FROM users WHERE email=%s",(email,))
        exisiting_user=cursor.fetchone()
        if exisiting_user:
            return jsonify({"message": "Email already exists"}),409
        cursor.execute("INSERT INTO users(name, email, password)VALUES(%s,%s,%s)",(name,email,password))
        db.commit()
        return jsonify({"message": "User Registered Successfully."})
    except Exception as e:
        print(f"Error:{str(e)}")
        return jsonify({"error": str(e)}),500

@app.route('/login', methods=['POST'])
def login():
    data=request.json
    email=data.get('email')
    password=data.get('password')
    try:  
        cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s",(email,password))
        user=cursor.fetchone()
        if user:
            token=jwt.encode({
                'user_id': user['id'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            }, SECRET_KEY, algorithm="HS256")
            if isinstance(token, bytes):   
                token=token.decode('utf-8')
            return jsonify({
                "message": "Login successful",
                "token": token
            }),200
        return jsonify({"message": "Invalid email or password"}),401
    except Exception as e:
        print(f"Error:{str(e)}")
        return jsonify({"message": "login failed"})

@app.route('/addContact', methods=['POST'])
def add_contact():
    user_id=verify_token()
    if not user_id:
        return jsonify({"message": "Unauthorized"}),401
    data=request.json
    name=data.get('name')
    email=data.get('email')
    phone_no=data.get('phone_no')
    location=data.get('location')
    try:
        cursor.execute("INSERT INTO contacts(user_id,name,email,phone_no,location)VALUES(%s,%s,%s,%s,%s)",(user_id,name,email,phone_no,location))
        db.commit()
        return jsonify({"message": "Contact added Successfully."}),201
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"message": "Failed to add contact"})

@app.route('/getContact', methods=['GET'])
def get_contacts():
    user_id=verify_token()
    if not user_id:
        return jsonify({"message": "Unauthorized"}),401
    try:
        cursor.execute("SELECT id,name,phone_no,email,location,created_at FROM contacts WHERE user_id=%s",(user_id,))
        contacts=cursor.fetchall()
        if not contacts:
            return jsonify({"message": "No Contacts Available."}),404
        return jsonify({"contacts": contacts}),200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"message": "Failed to load contacts"})

@app.route('/updateContact/<int:id>', methods=['PUT'])
def update_details(id):
    user_id=verify_token()
    if not user_id:
        return jsonify({"message": "Unauthorized"}),401
    data=request.json
    name=data.get('name')
    email=data.get('email')
    phone_no=data.get('phone_no')
    location=data.get('location')
    try:
        cursor.execute("UPDATE contacts SET name=%s, email=%s, phone_no=%s, location=%s WHERE id=%s AND user_id=%s",(name,email,phone_no,location,id,user_id))
        db.commit()
        return jsonify({"message": "Details Updated"}),200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"message": "Update failed"})

@app.route('/deleteContact/<int:id>', methods=['DELETE'])
def delete(id):
    user_id=verify_token()
    if not user_id:
        return jsonify({"message": "Unauthorized"}),401
    try:
        cursor.execute("DELETE FROM contacts WHERE id=%s and user_id=%s",(id,user_id))
        db.commit()
        if cursor.rowcount==0:
            return jsonify({"message": "Contacts not found"}),404
        return jsonify({"message": "Contact deleted successfully."}),200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"message": "Failed to delete contact"})

@app.route('/logout', methods=['POST'])
def logout():
    auth_header=request.headers.get('Authorization')
    try:
        parts=auth_header.split(" ")
        token=parts[1]
        blacklist.add(token)
        return jsonify({"message": "Successfully logged out"}),200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"message": "Logout failed"}) 

if __name__=="__main__":
    app.run(debug=True)
