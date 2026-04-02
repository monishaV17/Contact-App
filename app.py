from flask import Flask,render_template,request,jsonify
import mysql.connector
import jwt
import datetime
app = Flask(__name__) 

SECRET_KEY="mysecretkey"

db=mysql.connector.connect(host="localhost", user="root", password="Monisha@123", database="contcatdb")
cursor=db.cursor(dictionary=True)

def verify_token():
    auth_header=request.headers.get('Authorization')
    if not auth_header:
        return None
    try:
        token=auth_header.spilt(" ")[1]
        data=jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return data['user_id']
    except:
        return None

@app.route('/Signup', methods=['POST'])
def signup():
    data=request.json
    name=data.get('name')
    email=data.get('email')
    password=data.get('password')
    cursor.execute("SELECT * FROM users WHERE email=%s",(email))
    exisiting_user=cursor.fetchone
    if exisiting_user:
        return {"message": "Email already exists"},409
    cursor.execute("INSERT INTO users(name, email, password)VALUES(%s,%s,%s)")
    db.commit()
    return {"message": "User Registered Successfully."}

@app.route('/Login', methods=['POST'])
def login():
    data=request.json
    email=data.get('email')
    password=data.get('password')
    cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s",(email,password))
    user=cursor.fetchone()
    if user:
        token=jwt.encode({
            'user_id': user['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm="HS256")

        return ({
            "message": "Login successful",
            "token": token
        })
    
    return ({"message": "Invalid email or password"}),401

@app.route('/new_contact', methods=['POST'])
def add_contact():
    user_id=verify_token()
    if not user_id:
        return {"message": "Unauthorized"},401
    data=request.json
    name=data.get('name')
    email=data.get('email')
    phone_no=data.get('phone_no')
    cursor.execute("INSERT INTO contacts(user_id,name,email,phone_no)VALUES(%s,%s,%s,%s)",(user_id,name,email,phone_no))
    cursor.fetchall()
    return {"message": "Contact added."}

@app.route('/get_contacts', methods=['GET'])
def get_contacts():
    user_id=verify_token()
    if not user_id:
        return {"message": "Unauthorized"},401
    cursor.execute("SELECT id, name, FROM contacts WHERE user_id=%s",(user_id))
    return jsonify(cursor.fetchall())

@app.route('/contact_details/<int:id>', methods=['GET'])
def contact_details(id):
    user_id=verify_token()
    if not user_id:
        return {"message": "Unauthroized"},401
    cursor.execute("SELECT * FROM contacts WHERE id=%s AND user_id=%s",(id,user_id))
    return jsonify(cursor.fetchall())

@app.route('/update/<int:id>', methods=['PUT'])
def update_details(id):
    user_id=verify_token()
    if not user_id:
        return {"message": "Unauthorized"},401
    data=request.json
    name=data.get('name')
    email=data.get('name')
    phone=data.get('phone_no')
    cursor.execute("UPDATE contact SET name=%s, email=%s, phone=%s, id=%s, user_id=%s",(name,email,id,user_id))
    cursor.fetchall()
    return {"message": "Details Updated"}

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete(id):
    user_id=verify_token()
    if not user_id:
        return {"message": "Unauthorized"},401
    cursor.execute("DELETE FROM contact WHERE id=%s and user_id=%s",(id,user_id))
    db.commit()
    if cursor.rowcount==0:
        return {"message": "Contacts not found"},404
    return {"message": "Contact deleted successfully."}

if __name__=="__main__":
    app.run(debug=True)