from flask import Flask
from flask import request
from PIL import Image
from io import BytesIO
import onnxruntime as ort

import cv2
import numpy as np
import pandas as pd
import hydrus_api
from dotenv import load_dotenv
import os

app = Flask(__name__)

kaomojis = [
    "0_0",
    "(o)_(o)",
    "+_+",
    "+_-",
    "._.",
    "<o>_<o>",
    "<|>_<|>",
    "=_=",
    ">_<",
    "3_3",
    "6_9",
    ">_o",
    "@_@",
    "^_^",
    "o_o",
    "u_u",
    "x_x",
    "|_|",
    "||_||",
]


load_dotenv()
model_location= os.getenv("model_location")
threshold_default=os.getenv("threshold_default")
hydrus_token=os.getenv("hydrus_api_key")
hydrus_service_key=os.getenv("service_key")
hydrus_url=os.getenv("hydrus_url")


    
@app.route('/api/hydrus_single_import', methods=['POST'])
def hydrus_single_import():
    threshold = float(threshold_default) 
    image = request.files['image'].read()
    img_binary = BytesIO(image)

    img = Image.open(img_binary)
    img_binary.seek(0)

    img = img.convert('RGBA')
    new_image = Image.new('RGBA', img.size, 'WHITE')
    new_image.paste(img,mask=img)
    img = new_image.convert('RGB')
    img = np.asarray(img)
    img = img[:, :, ::-1]

    model = ort.InferenceSession('./public/models/'+model_location+'/model.onnx', providers=['AzureExecutionProvider', 'CPUExecutionProvider'])
    _, height, _, _  = model.get_inputs()[0].shape
    img  = make_square(img,height)
    img = smart_resize(img, height)
    img = img.astype(np.float32)
    img = np.expand_dims(img, 0)

    input_name = model.get_inputs()[0].name
    label_name = model.get_outputs()[0].name
    confidents = model.run([label_name], {input_name: img})[0]

    tags = pd.read_csv('./public/models/'+model_location+'/selected_tags.csv')

    tags = tags[:][['name']]
    tags['confidents'] = confidents[0]
    tags= dict(tags.values)

    clipped_tags = []
    for key in tags.keys():
        if(tags[key] > threshold):
            clipped_tags.append(key.replace("_", " ") if key not in kaomojis else key)
    result = hydrus_post(img_binary.getvalue(),clipped_tags)
    return {'result':result, 'tags': clipped_tags}





def hydrus_post(img_binary,ai_tags):
    token = hydrus_token
    client = hydrus_api.Client(token,hydrus_url)
    t= BytesIO(img_binary)
    t.seek(0)
    result = client.add_file(t)
    i = [result["hash"]]
    service_key = hydrus_service_key
    service_keys_to_tags = {
        service_key: ai_tags
    }
    client.add_tags(hashes=[result["hash"]], service_keys_to_tags=service_keys_to_tags)
    return result





#Based on the wd-e621-hydrus-tagger project located here: https://github.com/Garbevoir/wd-e621-hydrus-tagger
def make_square(img,target_size):
    old_size = img.shape[:2]
    desired_size = max(old_size)
    desired_size = max(desired_size, target_size)
    delta_w = desired_size - old_size[1]
    delta_h = desired_size - old_size[0]
    top, bottom = delta_h // 2, delta_h - (delta_h // 2)
    left, right = delta_w // 2, delta_w - (delta_w // 2)

    color = [255,255,255]
    new_im = cv2.copyMakeBorder(
        img, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color
    )
    return new_im

def smart_resize(img,size):

    if img.shape[0] > size:
        img = cv2.resize(img,(size,size), interpolation=cv2.INTER_AREA)
    elif img.shape[0] < size:
        img = cv2.resize(img,(size,size), interpolation=cv2.INTER_CUBIC)
    return img