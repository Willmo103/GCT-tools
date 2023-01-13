class Entry {
  constructor(content) {
    this.content = content;
    this.type = null;
  }

  getQuestion() {
    return this.question;
  }

  getAnswer() {
    return this.answer;
  }

  getContent() {
    return this.content;
  }
}

class Question extends Entry {
  constructor(content, answer) {
    super();
    this.content = content;
    this.answer = answer;
  }
}

class Answer extends Entry {
  constructor(content, question) {
    super();
    this.content = content;
    this.question = question;
  }
}

function serialize() {
  if (window.location.host === "chat.openai.com") {
    const divs = document.querySelectorAll("div");
    console.log(divs.length);

    const data = {};
    let lastEntry = null;
    let key;
    let i = 0;
    let lastEntry_ky;
    for (let div of divs) {
      if (
        div.classList.contains("markdown") &&
        (lastEntry === null || lastEntry.content !== div.innerText)
      ) {
        data[i] = new Answer(div.innerText, "question_" + (i - 1));
        data[i].type = "answer";
        lastEntry = data[i];
        lastEntry_ky = i;
        i++;
      } else if (
        div.classList.contains("min-h-[20px]") &&
        (data[lastEntry_ky] instanceof Answer ||
          data === {} ||
          typeof data[lastEntry_ky] === "undefined")
      ) {
        data[i] = new Question(div.innerText, "answer_" + (i + 1));
        data[i].type = "question";
        lastEntry = data[i];
        lastEntry_ky = i;
        i++;
      }
    }

    const cleanedData = {};
    for (let item in data) {
      cleanedData[`${data[item].type}_${item}`] = data[String(item)];
    }

    for (key in cleanedData) {
      console.log(key, cleanedData[key]);
    }
    let json = JSON.stringify(cleanedData);
    return json;
  }
  return null;
}

function download() {
  // Create a link and append it to the body
  let link = document.createElement("a");
  link.innerText = "Download data";
  link.href = "#";
  link.style.display = "block";
  document.body.appendChild(link);

  // Attach an event listener to the link
  link.addEventListener("click", function (event) {
    event.preventDefault();
    let json = serialize();
    let blob = new Blob([json], { type: "application/json" });
    link.href = URL.createObjectURL(blob);
    link.download = "scraped-data.json";
  });
}

download();
