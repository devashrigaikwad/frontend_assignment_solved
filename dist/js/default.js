// Your application goes here
import { url } from './environment.js';
import { FormElementTypeText, FormElementTypeRadio, onFormInputTextValidate, onFormRadioValidate } from './form-element.js'

const formElement = document.querySelector('form');
let formQuestions = [];

getQuestions();

function getQuestions() {
    fetch(url)
        .then(res => res.json())
        .then(res => {
            renderQuestions(res);
        })
        .catch(err => {
            console.log(err)
            alert("Error getting questions. Please check the url")
        })
}

function renderQuestions(questions) {
    formQuestions = questions;
    const otherThanTextTypes = ['radio', 'checkbox', 'select'];
    const questions$ = questions.map((question) => {
        if (otherThanTextTypes.indexOf(question.type) === -1) {
            return FormElementTypeText(question);
        }
        if (question.type === 'radio') {
            return FormElementTypeRadio(question)
        }
        return '';
    })
    const submitBtn = `<button class="btn btn-submit btn-primary float-end">Submit</button>`;
    const heading = `<h4>Personally Identifiable Information</h4>`;
    questions$.push(submitBtn);
    questions$.unshift(heading);
    formElement.innerHTML = questions$.join('');
    formElement.addEventListener('submit', onFormSubmit);
    formValidate();
}

function formValidate() {
    formQuestions.forEach((question) => {
        if (question.type == 'radio') {
            const formElementRadios = formElement.querySelectorAll(`input[name=${question.name}]`);
            formElementRadios.forEach((formElementRadio) => {
                formElementRadio.addEventListener('change', (event) => onFormRadioValidate(event.target))
            })

        } else {
            const formElementInput = formElement.querySelector(`input[name=${question.name}]`);
            if (formElementInput) {
                formElementInput.addEventListener('keyup', (event) => onFormInputTextValidate(event.target))
            }
        }

    })
}



function onFormSubmit(event) {
    event.preventDefault();
    const answers = [];
    formQuestions.forEach((question) => {
        if (question.type == 'radio') {

            const formElementRadios = formElement.querySelectorAll(`input[name=${question.name}]`);
            const validRadio = onFormRadioValidate(formElementRadios[0]);
            if (validRadio) {
                const formElementRadioChecked = formElement.querySelector(`input[name=${question.name}]:checked`);
                if (formElementRadioChecked) {
                    answers.push({ name: question.name, value: formElementRadioChecked.value })

                }
            }

        } else {
            const formElementInput = formElement.querySelector(`input[name=${question.name}]`);
            if (formElementInput) {
                const validInput = onFormInputTextValidate(formElementInput);
                if (validInput) {
                    answers.push({ name: question.name, value: formElementInput.value })
                }
            }
        }

    });
    if (answers.length != formQuestions.length) {
        alert("You have errors in your form");
        return;
    }
    saveAnswers(answers);
}


function saveAnswers(answers) {

    fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            alert("form data saved successfully")
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("form data saved failed")

        });
}