import { afterEach, beforeEach, vi, test, expect, assert } from "vitest";
import { PopupManager } from './popup-manager';
import { RequestManager } from './request-manager';
import { Logger } from './logger';
import { BusinessManager } from './business-manager';

let popupManager = null;
let requestManager = null;
let logger = null;
let responsesContainer = null;

let businessManager = null;

beforeEach(() => {
    popupManager = {
        showMessage: vi.fn()
    };

    requestManager = {
        post: vi.fn()
    };

    logger = {
        info: vi.fn(),
        error: vi.fn()
    }

    responsesContainer = {
        textContent: ""
    };

    vi.spyOn(PopupManager.prototype, 'constructor').mockImplementation(() => popupManager);
    vi.spyOn(RequestManager.prototype, 'constructor').mockImplementation(() => requestManager);
    vi.spyOn(Logger.prototype, 'constructor').mockImplementation(() => logger);

    businessManager = new BusinessManager(popupManager, requestManager, logger);

    businessManager.responsesContainer = responsesContainer;
});

afterEach(() => {
    vi.restoreAllMocks();
});

test('should show popup on error', async () => {
    const requestText = 'miAspettoUnErrore';

    const mockedPostError = new Error("oh no, si e' rotto");
    requestManager.post.mockImplementation(() => {
        throw mockedPostError;
    });

    await businessManager.performRequest(requestText);

    expect(requestManager.post).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(popupManager.showMessage).toHaveBeenCalledTimes(1);

    expect(logger.error).toHaveBeenCalledWith(expect.any(String), mockedPostError);
});

test('should log on success', async() => {
    const requestText = 'dovrebbeAndare';
    const mockedResponse = {
        'una': 'risposta'
    };

    requestManager.post.mockImplementation(() => {
        return mockedResponse;
    });

    await businessManager.performRequest(requestText);

    expect(requestManager.post).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(popupManager.showMessage).toHaveBeenCalledTimes(0);

    expect(logger.info).toHaveBeenCalledWith(expect.any(String), mockedResponse);
    assert.include(responsesContainer.textContent, JSON.stringify(mockedResponse));
});