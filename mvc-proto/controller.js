(async (window) => {

    function Controller(model, view) {
        this.model = model;
        this.view = view;

        this.view.bind("answer", this.answer.bind(this));

    }

    Controller.prototype.init = async function () {

        try {
            await this.model.fetch();
            this.nextQuestion();
        } catch (err) {
            console.log(err);
            alert("データのロードに失敗しました。");
        }

    }

    Controller.prototype.nextQuestion = function () {

        this.model.question = this.model.questionList.shift();
        this.view.render(this.model.question);

    }

    Controller.prototype.answer = function () {

        let answer = ""

        Array.from(this.view.answerItemList.children).forEach((item) => {
            answer = answer + item.dataset.id;
        });

        if (this.model.question.answer === answer) {

            if (this.model.questionList.length === 0) {
                alert("正解！！お疲れ様でした!!");
                window.location.reload();
            } else {
                this.nextQuestion();
            }

        } else {
            alert("不正解");
        }

    }

    window.app = window.app || {};
    window.app.Controller = Controller;

})(window);