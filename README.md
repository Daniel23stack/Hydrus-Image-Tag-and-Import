## Introduction

This is a tool for importing and tagging images and importing into the hydrus client. You can find the hydrus library and installation at this link: https://github.com/hydrusnetwork/hydrus. The objective of this project is to facilitate seamless AI tagging and importing into the hydrus by leveraging the hydrus API, Next.js, and Python Libraries.

## How It Works

This project utilizes Next.js and Python to enable AI tagging by submitting images to the API. Easily upload an image by dragging and dropping it into the designated area, then click submit. If you receive a JSON response from hydrus and the associated tags, it indicates that your project is set up correctly. This project enables you to effortlessly drag and drop items between web browsers or your personal files for seamless organization.


## Getting Started
First open the file .env in a text editor.

Second, model setup:

1. Download the contents of the SmilingWolf Tagging models https://huggingface.co/SmilingWolf/wd-vit-large-tagger-v3
2. Place the contents in the a folder under the public/models folder
  ex: public/models/SmilingWolf_wd-vit-large-tagger-v3

Third, Hydrus Setup:
1. In Hydrus navigate to services > manage service
2. Click "add" and select "local tag service"
3. Name your service ex: "Tag_and_Import"
4. Now navigate to services > review services
5. Under the tags tab of review servies click the tab of your named service.
6. Copy the service key > in the .env > paste it at the 'service_key' line of the env file.
7. Navigate to local > client api
8. Click "add", select "manually"
9. Name the new api the same of the service from above.
9. Click the check box next to the "edit file tags", "import and delete files", "search and fetch files" permissions.
10. Click the copy api access key > in the .env > paste the api access key into the hydrus_api_key parameter.

Fourth, install the dependencies:

```bash
python -m venv env

npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Once everything is functioning properly, you will be able to view a page displaying the message "Drag and Drop, or upload an image here". This form allows you to easily upload your images, add tags to them, and seamlessly import them into hydrus. Ensure that your hydrus client is open and configured to accept API calls.