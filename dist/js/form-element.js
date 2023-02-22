export const FormElementTypeText = (args) =>{
    const required = args.required?'required':'';
    const pattern = args.pattern?`pattern=${args.pattern}`:'';
    const patternText = args.pattern?`<div class="form-text"><small>Pattern: ${args.pattern}</small></div>`:'';
    return `
    <div class="form-group row mb-3">
    <label class="col-sm-2 col-form-label">${args.label}</label>
    <div class="col-sm-10">
    <input type="${args.type}" class="form-control" name="${args.name}" data-label="${args.label}" id="ele-${args.id}" ${required} ${pattern} aria-label="${args.label}">
    ${patternText}
    <div class="col-sm-12 invalid-feedback"></div>
    </div>
    
    </div>
    `
}

export const FormElementTypeRadio = (args) =>{
    return `
    <fieldset class="row mb-3">
    <legend class="col-form-label col-sm-2 pt-0">${args.legend}:</legend>
    <div class="col-sm-10">
    ${FormElementTypeRadioOptions(args.options, args)}
    <div class="col-sm-12 invalid-feedback"></div>
    </div>
    
</fieldset>`
}

export const FormElementTypeRadioOptions = (options, args) =>{
    const required = args.required?'required':'';
    return options.map((option, index) =>{
        return `<div  class="form-check">
        <input type="radio" id="ele-${option.id}" name="${args.name}" aria-label="${option.label}" value="${option.value}" ${!index?required:''}>
        <label for="ele-${option.id}">${option.label}</label>
      </div>`
    }).join('')
}

export const onFormRadioValidate = (element) =>{
    const elementName = element.getAttribute('name');
    const fieldset = element.closest('fieldset');
    const invalidFeedback = fieldset.querySelector('.invalid-feedback'); 
    const radioElements = fieldset.querySelectorAll(`input[name=${elementName}]`);
    let isRequired = false;
    invalidFeedback.innerText = '';
    invalidFeedback.style.display = 'none';
    radioElements.forEach((radioElement) => {
        if(radioElement.hasAttribute('required')){
            isRequired = true;
        }
    })
    if(!isRequired){
        return true;
    }
    
    const radioElementChecked = fieldset.querySelector(`input[name=${elementName}]:checked`);
    if(!radioElementChecked){
        invalidFeedback.innerText = 'Please select one of the options';
        invalidFeedback.style.display = 'block';
        return false;
    }
    return true;
}

export const onFormInputTextValidate = (element) => {
    const value = element.value;
    const required= element.hasAttribute('required');
    const pattern= element.getAttribute('pattern');
    const label= element.getAttribute('data-label');
    const type = element.getAttribute('type');
    element.classList.remove('is-invalid')
    const formGroup = element.closest('.form-group');
    const invalidFeedback = formGroup.querySelector('.invalid-feedback');
    invalidFeedback.innerText ='';
    if(required && !value){
            element.classList.add('is-invalid')
            invalidFeedback.innerText = `${label} is required`;
            return false;
    }
    if(pattern && value){
        const regex = new RegExp(`^${pattern}$`)
        if(!regex.test(value)){
            element.classList.add('is-invalid')
            invalidFeedback.innerText = `${label} is not in vaid format`;
            return false;
        }
    }
    if(type == 'email' && value){
        if(!validateEmail(value)){
            element.classList.add('is-invalid')
            invalidFeedback.innerText = `${label} is not in vaid format`;
            return false;
        }
    }
return true;
}

 const validateEmail = (email) => {
    // https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };