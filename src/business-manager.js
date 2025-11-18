export class BusinessManager {

    baseMessage = {
        message: ''
    }

    requestUrl = '/api/test';
    errorMessage = 'Something went wrong, retry later';

    constructor(popupManager, requestManager, logger){
        this.inputForm = null;
        this.responsesContainer = null;
        
        this.popupManager = popupManager;
        this.requestManager = requestManager;
        this.logger = logger;

        this.mustBeNotNullOrUndefined(this.popupManager);
        this.mustBeNotNullOrUndefined(this.requestManager);
        this.mustBeNotNullOrUndefined(this.logger);
    }

    handleSubmission(event) {
        event.preventDefault();

        const text = this.inputForm.querySelector('input[type="text"]').value;
        this.performRequest(text);

        return false;
    }

    configureDOMobjects(inputForm, responsesContainer){
        this.inputForm = inputForm;
        this.responsesContainer = responsesContainer;

        this.mustBeNotNullOrUndefined(this.inputForm);
        this.mustBeNotNullOrUndefined(this.responsesContainer);

        this.inputForm.addEventListener("submit", (e) => {
            this.handleSubmission(e);
        });
    }

    mustBeNotNullOrUndefined(something){
        if (!something) {
            throw new Exception("something is null or undefined, it must not.");
        }
    }

    showError() {
        this.popupManager.showMessage(this.errorMessage);
    }

    writeResponse(response) {
        this.responsesContainer.textContent += JSON.stringify(response) + '\n';
    }

    async performRequest(text){
        const payload = structuredClone(this.baseMessage);
        payload.message = text;
        
        try {
            const response = await this.requestManager.post(this.requestUrl, payload);
            this.logger.info(`response`, response);
            this.writeResponse(response);
        } catch (e) {
            this.logger.error(`response error`, e);
            this.showError();
        }
 
    }

}