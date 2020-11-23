(async (window) => {

    function View() {

        this.itemElements = document.querySelectorAll(".item");
        this.itemListElements = document.querySelectorAll(".item-list");
        this.selectItemList = document.getElementById("select-item-list");
        this.answerItemList = document.getElementById("answer-item-list");
        this.btnAnswer = document.getElementById("btn-answer");


        this.itemListElements.forEach((itemListElement, idx) => {
            itemListElement.addEventListener("dragover", dragoverHandler);
            itemListElement.addEventListener("drop", ItemListDropHandler);
        })

    }

    View.prototype.bind = function (event, handler) {

        if (event == "answer") {
            this.btnAnswer.addEventListener("click", handler);
        }

    }


    View.prototype.render = async function (question) {

        this.selectItemList.textContent = "";
        this.answerItemList.textContent = "";

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

            this.selectItemList.appendChild(itemElement);
        })

    }

    function itemDragStartHandler(e) {
        e.stopPropagation();

        e.dataTransfer.setData("application/item", e.target.id);
        e.dataTransfer.setData("text/screenY", e.screenY);
        const sourceId = e.dataTransfer.getData("application/item");

    }

    function dragoverHandler(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
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

    window.app = window.app || {};
    window.app.View = View;

})(window);