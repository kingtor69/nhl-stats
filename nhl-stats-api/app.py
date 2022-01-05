from flask import Flask, request, redirect, render_template
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db
import requests

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///capstone2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.confi['SQLALCHEMY_ECHO'] = True

connect_db(app)