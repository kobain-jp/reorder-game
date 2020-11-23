
(async () => {

    let questionList = [];
    let question = {};

    const itemElements = document.querySelectorAll(".item");
    const itemListElements = document.querySelectorAll(".item-list");
    const selectItemList = document.getElementById("select-item-list");
    const answerItemList = document.getElementById("answer-item-list");
    const btnAnswer = document.getElementById("btn-answer");

    async function init() {

        try {
            bindEvent();
            await loadQuestions();
            nextQuestion();
        } catch (err) {
            console.log(err);
            alert("データのロードに失敗しました。");

        }
    }

    function bindEvent() {

        itemListElements.forEach((itemListElement, idx) => {

            itemListElement.addEventListener("dragover", dragoverHandler);
            itemListElement.addEventListener("drop", ItemListDropHandler);

        })

        btnAnswer.addEventListener("click", answer);

    }


    function ItemListDropHandler(e) {

        e.preventDefault();
        e.stopPropagation();

        const sourceId = e.dataTransfer.getData("application/item");
        const sourceScreenY = e.dataTransfer.getData("text/screenY");
        const sourceElement = document.getElementById(sourceId);

        // １番目のアイテムよりも座標が高い場合
        if (e.target.childElementCount !== 0 &&
            e.pageY < e.target.children[0].getBoundingClientRect().top + window.pageYOffset) {

            e.target.prepend(document.getElementById(sourceId));

        } else {

            e.target.appendChild(document.getElementById(sourceId));

        }

    }

    function dragoverHandler(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }

    async function loadQuestions() {

        try {
            response = await fetch("./data.json");
            questions = await response.json();
        } catch (error) {
            throw new Error(error);
        }


    }

    function nextQuestion() {
        question = questions.shift();
        render();
    }


    function render() {
        selectItemList.textContent = "";
        answerItemList.textContent = "";
        question.choices.forEach((choice, idx) => {
            const itemElement = document.createElement("li");

            itemElement.id = idx;
            itemElement.classList.add("item");
            itemElement.setAttribute("data-id", idx);
            itemElement.setAttribute("draggable", true);
            itemElement.insertAdjacentHTML('beforeend', choice);
            itemElement.addEventListener("dragstart", itemDragStartHandler);
            itemElement.addEventListener("dragover", dragoverHandler);
            itemElement.addEventListener("drop", itemDropHandler);

            selectItemList.appendChild(itemElement);
        })

    }


    function itemDragStartHandler(e) {
        e.stopPropagation();

        e.dataTransfer.setData("application/item", e.target.id);
        e.dataTransfer.setData("text/screenY", e.screenY);
        const sourceId = e.dataTransfer.getData("application/item");

    }

    function itemDropHandler(e) {

        e.preventDefault();
        e.stopPropagation();

        const ulElement = e.target.parentElement;
        const sourceId = e.dataTransfer.getData("application/item");
        const sourceElement = document.getElementById(sourceId);
        const sourceScreenY = e.dataTransfer.getData("text/screenY");

        if (sourceScreenY < e.screenY) {
            ulElement.insertBefore(sourceElement, e.target.nextSibling);
        } else {
            ulElement.insertBefore(sourceElement, e.target);
        }

        e.dataTransfer.clearData();
    }

    function answer() {

        let answer = ""

        Array.from(answerItemList.children).forEach((item) => {
            answer = answer + item.dataset.id;
        });

        if (question.answer === answer) {

            if (questions.length === 0) {
                alert("正解！！お疲れ様でした!!");
                window.location.reload();
            } else {
                nextQuestion();
            }

        } else {
            alert("不正解");
        }

    }

    await init();

})();