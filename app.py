from flask import Flask,request
import mysql.connector
import jwt
import datetime
app = Flask(__name__) 

SECRET_KEY="mysecretkey"
blacklist=set()

db=mysql.connector.connect(host="localhost", user="root", password="xyz", database="contactdb")
cursor=db.cursor(dictionary=True)

def verify_token():
    auth_header=request.headers.get('Authorization')
    if not auth_header:
        return None
    try:
        token=auth_header.spilt(" ")[1]
        if blacklist(token):
            return None
        data=jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return data['user_id']
    except Exception as e:
        print(f"Error: {str(e)}1")
        return None

@app.route('/signup', methods=['POST'])
def signup():
    data=request.json
    name=data.get('name')
    email=data.get('email')
    password=data.get('password')
    try:
        cursor.execute("SELECT * FROM users WHERE email=%s",(email,))
        exisiting_user=cursor.fetchone()
        if exisiting_user:
            return {"message": "Email already exists"},409
        cursor.execute("INSERT INTO users(name, email, password)VALUES(%s,%s,%s)",(name,email,password))
        db.commit()
        return {"message": "User Registered Successfully."}
    except Exception as e:
        print(f"Error:{str(e)}")
        return {"message": "signup failed"}

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
            return ({
                "message": "Login successful",
                "token": token
            })
        return ({"message": "Invalid email or password"}),401
    except Exception as e:
        print(f"Error:{str(e)}")
        return {"message": "login failed"}

@app.route('/new_contact', methods=['POST'])
def add_contact():
    user_id=verify_token()
    if not user_id:
        return {"message": "Unauthorized"},401
    data=request.json
    name=data.get('name')
    email=data.get('email')
    phone_no=data.get('phone_no')
    try:
        cursor.execute("INSERT INTO contacts(user_id,name,email,phone_no)VALUES(%s,%s,%s,%s)",(user_id,name,email,phone_no))
        db.commit()
        return {"message": "Contact added."}
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"message": "Failed to add contact"}

@app.route('/get_contacts', methods=['GET'])
def get_contacts():
    user_id=verify_token()
    if not user_id:
        return {"message": "Unauthorized"},401
    try:
        cursor.execute("SELECT * FROM contacts WHERE user_id=%s",(user_id))
        contacts=cursor.fetchall()
        if not contacts:
            return {"message": "No Contacts"}
        return (contacts)
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"message": "Failed to load contacts"}

@app.route('/update/<int:id>', methods=['PUT'])
def update_details(id):
    user_id=verify_token()
    if not user_id:
        return {"message": "Unauthorized"},401
    data=request.json
    name=data.get('name')
    email=data.get('name')
    phone=data.get('phone_no')
    try:
        cursor.execute("UPDATE contact SET name=%s, email=%s, phone=%s WHERE id=%s AND user_id=%s",(name,email,id,user_id))
        db.commit()
        return {"message": "Details Updated"}
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"message": "Update failed"}

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete(id):
    user_id=verify_token()
    if not user_id:
        return {"message": "Unauthorized"},401
    try:
        cursor.execute("DELETE FROM contact WHERE id=%s and user_id=%s",(id,user_id))
        db.commit()
        if cursor.rowcount==0:
            return {"message": "No contacts found"}
        return {"message": "Contact deleted successfully."}
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"message": "Failed to delete contact"}

@app.route('/logout', methods=['POST'])
def logout():
    auth_header=request.headers.get('Authorization')
    try:
        token=auth_header.split(" ")[1]
        blacklist.add(token)
        return {"message": "Successfully logged out"}
    except Exception as e:
        print(f"Error: str{e}")
        return {"message": "Logout failed"} 

if __name__=="__main__":
    app.run(debug=True)
