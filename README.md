### Full Stack implementation of the Custom AI Chat Bot(Notion Chatbot)
This is a sister application to my the initial AIChatBot implementation found here: https://github.com/KobbyBawuah/AIChatBot. The aim of this version is to provide a user-friendly web interface, allowing users to simply visit a website, upload their documents, and start interacting with the chatbot powered by the OpenAI language model. The application utilizes the OpenAI language model to generate responses to user input. It involves loading data provided by the user, querying an index made from that data, and engaging in continuous interactions with the user. By considering both the provided chat history and the user's questions, the chatbot generates appropriate responses. In short, this app takes uploaded files, embeds them into vectors, stores them into Pinecone, and allows semantic searching of the data.


### Prerequisites
To run this app, you need the following:
- An [OpenAI API](https://platform.openai.com/) key: You can obtain an API key from the OpenAI website. (OPtional)-> You could consider setting the OPENAI_API_ORG.
- [Pinecone API Key](https://app.pinecone.io/organizations/-NalvPDNU4OBLzvzVC7t/projects/gcp-starter:5718e41/indexes): To use Pinecone as the vector database, you need a Pinecone API key. You will also need to set the environment. Make sure your Pinecone environment is an actual environment given to you by Pinecone, like `us-west4-gcp-free`.

### Up and Running (Website)
To use the web application, follow this link:


### Up and Running (Developer)
To run the app locally, follow these steps:

Clone this repository:
```bash
git clone https://github.com/KobbyBawuah/Fullstack-Notion-Chatbot.git
cd Fullstack-Notion-Chatbot
```

Install the dependencies using either NPM or Yarn:
```bash
npm install
# or
yarn
```

Copy the details of .example.env.local to a new file called .env and update it with your API keys and environment:
```bash
cp .example.env.local .env
```

Update the .env file with your actual API keys for OpenAI and Pinecone.

(Optional) - Add your own custom text or markdown files into the /documents folder. Currently, there is already a sample file in the documents folder.

Run the app:
locally=
```bash
npm run dev
```

production version=
```bash
npm run build
npm run start
```

Open http://localhost:3000 with your browser to access the application.

### Usage
Once the application is running, visit http://localhost:3000 in your web browser.

Upload your documents: Use the interface to upload the text or markdown files you want to use for interactions with the chatbot.

Start Interacting: The app will use Pinecone to store document embeddings and OpenAI's language model (GPT-3) to answer your questions based on the uploaded documents.

Continuous Interactions: The chatbot considers both the provided chat history and your questions to generate appropriate responses, allowing you to engage in continuous interactions.



### Side Note
To adjust this bot to work with Notion there are two possible ways:

# Manual 
1. You could export the .md files from Notion and run an unzip command to insert the files into the Notion DB directory.
2. Then you could just adjust the directory path in the setup/route to point at the Notion_DB directory. 

# Automatic
1. Load and update documents from Notion using the tool in llama hub:
https://llamahub.ai/l/tools-notion 

2. Adjust the code acordingly. 


# TODO:
//Ongoing -> update ui
Done -> //get users to upload then click create index and embedding. If user deletes document. Clear trained value and past messages
Done ->Delete documents button
DONE-> //when loading is done, show chat bot 
  //set up history tracking
  //instrument moderation
  //look into setting up promts and keeping the last messages for context
  //look into loading screen when the bot is creating embedings and the index, for file upload and saved files deleation
  //create new index with an id for each load. This will allow users to make diffrent indexs in pinecone
