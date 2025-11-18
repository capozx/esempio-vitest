import { BusinessManager } from './business-manager';
import { Logger } from './logger'
import { PopupManager } from './popup-manager'
import { RequestManager } from './request-manager';
import './style.css'

const logger = new Logger();
const popupManager = new PopupManager();
const requestManager = new RequestManager();

const businessManager = new BusinessManager(popupManager, requestManager, logger);
businessManager.configureDOMobjects(document.querySelector("form"), document.querySelector("pre"))
