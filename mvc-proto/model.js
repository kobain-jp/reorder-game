(async (window) => {

    function Model() {
        this.questionList = [];
        this.question = {};
    }

    Model.prototype.fetch = async function () {

        try {
            response = await fetch("./data.json");
            this.questionList = await response.json();
        } catch (error) {
            throw new Error(error);
        }
    }

    window.app = window.app || {};
    window.app.Model = Model;

})(window);