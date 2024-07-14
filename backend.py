from flask import Flask, request, jsonify, send_from_directory
import pymongo
import json
import google.generativeai as genai
import os
import oletools.olevba as olevba
import schemdraw
from schemdraw.flow import *
from reportlab.lib.units import mm

from reportlab.pdfgen import canvas 
from reportlab.pdfbase.ttfonts import TTFont 
from reportlab.pdfbase import pdfmetrics 
from reportlab.lib import colors 
genai.configure(api_key="AIzaSyA6MhXEjD1G-HcuGR2zxbMh4QB4LSkb9B8")
model = genai.GenerativeModel('gemini-pro')
app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = 'uploads'

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])
#Login Method
@app.route('/login',methods=['POST','GET'])
def validate_password():
    username=request.form["uname"]
    password=request.form["pass"]
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["vbaanalyser"]
    mycol = mydb["users"]
    useFlag='False'
    pasFlag='False'
    adminFlag='False'
    type=''
    id=''
    for x in mycol.find():
        if(x['uname']==username and x['pass']==password):
            useFlag='True'
            pasFlag='True'
            print("Login Success")
           
            id=x['uid']
            
        elif(x['uname']==username and x['password']!=password):
            useFlag='True'
            print("Password Incorrect")
    return {'UsernameFlag':useFlag,"PasswordFlag":pasFlag,"UserName":username,'uid':id}

#Upload and Process Files
@app.route('/upload',methods=['POST','GET'])
def upload_file():
    if 'file' not in request.files:
        print("ERROR")
        return jsonify({'error': 'No file part'}), 400
        
    
    file = request.files['file']
    if file.filename == '':
        print("ERROR")
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], 'temp.xlsm'))
    uid=request.form['uid'];
    code=extract_vba()
    print(code)
    doc=generate_docu(code)
    logic=extract_function_logic(code)
    
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["vbaanalyser"]
    mycol = mydb["requests"]
    id=0
    for x in mycol.find():
        id+=1
    id=id+1
    id="VB"+str(id)
    s=draw_flow(code,id)
    mycol.insert_one({'codereceive':code,'codewithdoc':doc,'logic':logic,'uid':uid,'id':id})


    return {'codereceive':code,'codewithdoc':doc,'logic':logic}
#Download Process Flow Diagarm
@app.route('/getfile', methods=['GET'])
def get_file():
    filename = 'flowchart.jpeg'  
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

#Get all the code analysed by the user
@app.route('/prev',methods=['GET','POST'])
def get_past_analysis():
      myclient = pymongo.MongoClient("mongodb://localhost:27017/")
      mydb = myclient["vbaanalyser"]
      mycol = mydb['requests']
      ans=mycol.find()
      d={"req":[]}
      for doc in ans:
        
            a=doc.pop("_id")
            d['req'].append(doc)
    
           
      return d

#Generate Report 
@app.route('/getreport',methods=['GET','POST'])
def generate_report():
    param1 = request.args.get('param1')
    fileName = 'report.pdf'
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["vbaanalyser"]
    mycol = mydb['requests']
    for row in mycol.find():
        if(row['id']==param1):
            data=row
    code=data['codereceive']
    doc=data['codewithdoc']
    log=data['logic']
   
    pdf = canvas.Canvas('./uploads/report.pdf') 
  

    pdf.setTitle('VBA Code Analysis Report') 
    pdf.setFillColorRGB(0, 0, 0) 
    pdf.setFont("Courier-Bold", 18) 
    pdf.drawCentredString(290, 720, 'Automated VBA Code Documentation and Transformation') 
    pdf.drawCentredString(290, 680, 'Extracted Code')
    text = pdf.beginText(70, 660) 
    text.setFont("Courier", 10)
    codeLines=code.split('\n') 
    for line in codeLines:
        text.textLine(line)
    pdf.drawText(text)
    pdf.setFillColorRGB(0, 0, 0) 
    pdf.setFont("Courier-Bold", 18)
    pdf.drawCentredString(290, 500, 'Documented Code')
    text = pdf.beginText(70, 480) 
    text.setFont("Courier", 10)
    docLines=doc.split('\n') 
    for line in docLines:
        text.textLine(line)
    pdf.drawText(text)
    pdf.showPage()
    pdf.setFillColorRGB(0, 0, 0) 
    pdf.setFont("Courier-Bold", 18)
    pdf.drawCentredString(290, 720, 'Functional  Logic')
    text = pdf.beginText(70, 660) 
    text.setFont("Courier", 10)
    logLines=log.split('\n') 
    for line in logLines:
        text.textLine(line.replace("*",""))
    pdf.drawText(text)
    pdf.showPage()
    pdf.setFillColorRGB(0, 0, 0) 
    pdf.setFont("Courier-Bold", 18)
    pdf.drawCentredString(290, 720, 'Process Flow Diagram')
    imgpath="./uploads/processflows/flowchart"+param1+".jpeg"
    pdf.drawImage(imgpath, x=100, y=200, height=152*mm, width=102*mm) 
   
    pdf.save()

    return send_from_directory(app.config['UPLOAD_FOLDER'], 'report.pdf')


#Extract Macro From XLSM File
def extract_vba():
    vba = olevba.VBA_Parser(r"./uploads/temp.xlsm")
    a=''
    with open("output.txt", "w") as f:
        for *_, n, m in vba.extract_all_macros():
           if n.startswith("Module"):
              print(m, file=f)
              a+=m
    #print(a)
    return a
#Generate the code with documentation
def generate_docu(code):
    try:
        res=model.generate_content("""Generate the documentation for the VBA code and return the modified code with appropriate documentation.The documentation must clearly define the logic data flow and process flow:::"""+ code)
        #print(res.text)
        return res.text
    except:
        print('Error')

#Generate Function Logic Explanation
def extract_function_logic(code):
    try:
        res=model.generate_content("""Extract the function logic from the VBA code and explain it in simple words:::"""+ code)
        #print(res.text)
        return res.text
    except:
        print('Error')
#Draw Process Flow Diagram
def draw_flow(code,id):
   
        res=model.generate_content(code+"""\n Generate the steps in brief 4 to 5 words Each step must be listed in a new line.""")
        s=res.text
        sl=s.split("\n")
        d=schemdraw.Drawing()
        d+= Start().label("Start")
        d+= Arrow().down(d.unit/2)
        for i in sl:
            if (i==''):
              continue
            d+= Box(w = 20).label(i)
            d+= Arrow().down(d.unit/2)
        d+= Start().label("End")
        d.save(r"./uploads/flowchart.jpeg", dpi = 300)
        d.save(r"./uploads/processflows/flowchart"+id+".jpeg", dpi = 300)
        #image_url = url_for('uploads', filename='flowchart.jpeg', _external=True)
        return s
        
       
    
        #print(sl)


if __name__ == '__main__':
    app.run(debug='True',port=5000)