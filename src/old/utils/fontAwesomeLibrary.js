import { library } from '@fortawesome/fontawesome-svg-core';
// fab prefix icons - <FontAwesomeIcon icon={['fab', 'cc-mastercard']} />
import { faCcMastercard } from '@fortawesome/free-brands-svg-icons/faCcMastercard';
import { faCcVisa } from '@fortawesome/free-brands-svg-icons/faCcVisa';
// fas prefix icons - <FontAwesomeIcon icon={['fas', 'circle']} />
import { faCheck as fasCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCheckCircle as fasCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faPrint } from '@fortawesome/free-solid-svg-icons/faPrint';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons/faStar';
import {
  faSortDown,
  faSortUp,
  faSort as fadSort,
} from '@fortawesome/pro-duotone-svg-icons';
import { faAddressBook as falAddressBook } from '@fortawesome/pro-light-svg-icons/faAddressBook';
import { faCircleCheck as falCircleCheck } from '@fortawesome/pro-light-svg-icons/faCircleCheck';
import { faCircleQuestion as falCircleQuestion } from '@fortawesome/pro-light-svg-icons/faCircleQuestion';
import { faFileInvoiceDollar as falFileInvoiceDollar } from '@fortawesome/pro-light-svg-icons/faFileInvoiceDollar';
import { faHammer as falHammer } from '@fortawesome/pro-light-svg-icons/faHammer';
import { faScrewdriverWrench as falScrewdriverWrench } from '@fortawesome/pro-light-svg-icons/faScrewdriverWrench';
import { faShop as falShop } from '@fortawesome/pro-light-svg-icons/faShop';
// far prefix icons - <FontAwesomeIcon icon={['far', 'address-book']} />
import { faAddressBook } from '@fortawesome/pro-regular-svg-icons/faAddressBook';
import { faArrowCircleUp } from '@fortawesome/pro-regular-svg-icons/faArrowCircleUp';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons/faArrowRight';
import { faBadgeDollar } from '@fortawesome/pro-regular-svg-icons/faBadgeDollar';
import { faBan } from '@fortawesome/pro-regular-svg-icons/faBan';
import { faBars } from '@fortawesome/pro-regular-svg-icons/faBars';
import { faBath } from '@fortawesome/pro-regular-svg-icons/faBath';
import { faBed } from '@fortawesome/pro-regular-svg-icons/faBed';
import { faBell } from '@fortawesome/pro-regular-svg-icons/faBell';
import { faBullseye } from '@fortawesome/pro-regular-svg-icons/faBullseye';
import { faCalculator } from '@fortawesome/pro-regular-svg-icons/faCalculator';
import { faCalendarAlt } from '@fortawesome/pro-regular-svg-icons/faCalendarAlt';
import { faCamera } from '@fortawesome/pro-regular-svg-icons/faCamera';
import { faCar } from '@fortawesome/pro-regular-svg-icons/faCar';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import { faChartPie } from '@fortawesome/pro-regular-svg-icons/faChartPie';
import { faCheck } from '@fortawesome/pro-regular-svg-icons/faCheck';
import { faCheckCircle } from '@fortawesome/pro-regular-svg-icons/faCheckCircle';
import { faChevronDoubleDown } from '@fortawesome/pro-regular-svg-icons/faChevronDoubleDown';
import { faChevronDoubleRight } from '@fortawesome/pro-regular-svg-icons/faChevronDoubleRight';
import { faChevronDoubleUp } from '@fortawesome/pro-regular-svg-icons/faChevronDoubleUp';
import { faChevronDown } from '@fortawesome/pro-regular-svg-icons/faChevronDown';
import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import { faChevronUp } from '@fortawesome/pro-regular-svg-icons/faChevronUp';
import { faCircle as farCircle } from '@fortawesome/pro-regular-svg-icons/faCircle';
import { faCircleQuestion } from '@fortawesome/pro-regular-svg-icons/faCircleQuestion';
import { faClipboardCheck } from '@fortawesome/pro-regular-svg-icons/faClipboardCheck';
import { faClipboardList } from '@fortawesome/pro-regular-svg-icons/faClipboardList';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faCloudDownload } from '@fortawesome/pro-regular-svg-icons/faCloudDownload';
import { faCloudUpload } from '@fortawesome/pro-regular-svg-icons/faCloudUpload';
import { faCog } from '@fortawesome/pro-regular-svg-icons/faCog';
import { faCogs } from '@fortawesome/pro-regular-svg-icons/faCogs';
import { faComment } from '@fortawesome/pro-regular-svg-icons/faComment';
import { faCommentDollar } from '@fortawesome/pro-regular-svg-icons/faCommentDollar';
import { faCreditCardFront } from '@fortawesome/pro-regular-svg-icons/faCreditCardFront';
import { faDollarSign } from '@fortawesome/pro-regular-svg-icons/faDollarSign';
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons/faEllipsisH';
import { faEnvelope } from '@fortawesome/pro-regular-svg-icons/faEnvelope';
import { faExchange } from '@fortawesome/pro-regular-svg-icons/faExchange';
import { faExclamation } from '@fortawesome/pro-regular-svg-icons/faExclamation';
import { faExclamationCircle } from '@fortawesome/pro-regular-svg-icons/faExclamationCircle';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { faExpand } from '@fortawesome/pro-regular-svg-icons/faExpand';
import { faEye } from '@fortawesome/pro-regular-svg-icons/faEye';
import { faFileChartPie } from '@fortawesome/pro-regular-svg-icons/faFileChartPie';
import { faFileDownload } from '@fortawesome/pro-regular-svg-icons/faFileDownload';
import { faFileImage } from '@fortawesome/pro-regular-svg-icons/faFileImage';
import { faFileInvoiceDollar } from '@fortawesome/pro-regular-svg-icons/faFileInvoiceDollar';
import { faFileLines } from '@fortawesome/pro-regular-svg-icons/faFileLines';
import { faFilePdf } from '@fortawesome/pro-regular-svg-icons/faFilePdf';
import { faFileSignature } from '@fortawesome/pro-regular-svg-icons/faFileSignature';
import { faFileVideo } from '@fortawesome/pro-regular-svg-icons/faFileVideo';
import { faFilter as farFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFlag } from '@fortawesome/pro-regular-svg-icons/faFlag';
import { faHammer } from '@fortawesome/pro-regular-svg-icons/faHammer';
import { faHand } from '@fortawesome/pro-regular-svg-icons/faHand';
import { faHandHoldingUsd } from '@fortawesome/pro-regular-svg-icons/faHandHoldingUsd';
import { faHistory } from '@fortawesome/pro-regular-svg-icons/faHistory';
import { faHome } from '@fortawesome/pro-regular-svg-icons/faHome';
import { faList } from '@fortawesome/pro-regular-svg-icons/faList';
import { faListUl } from '@fortawesome/pro-regular-svg-icons/faListUl';
import { faLock } from '@fortawesome/pro-regular-svg-icons/faLock';
import { faLockOpen } from '@fortawesome/pro-regular-svg-icons/faLockOpen';
import { faLongArrowRight } from '@fortawesome/pro-regular-svg-icons/faLongArrowRight';
import { faMoneyBillTransfer } from '@fortawesome/pro-regular-svg-icons/faMoneyBillTransfer';
import { faMoneyCheckAlt } from '@fortawesome/pro-regular-svg-icons/faMoneyCheckAlt';
import { faPaperPlane } from '@fortawesome/pro-regular-svg-icons/faPaperPlane';
import { faPencil } from '@fortawesome/pro-regular-svg-icons/faPencil';
import { faPhone } from '@fortawesome/pro-regular-svg-icons/faPhone';
import { faPlusCircle } from '@fortawesome/pro-regular-svg-icons/faPlusCircle';
import { faScrewdriverWrench } from '@fortawesome/pro-regular-svg-icons/faScrewdriverWrench';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faSnooze } from '@fortawesome/pro-regular-svg-icons/faSnooze';
import { faSort } from '@fortawesome/pro-regular-svg-icons/faSort';
import { faSortAsc } from '@fortawesome/pro-regular-svg-icons/faSortAsc';
import { faSortDesc } from '@fortawesome/pro-regular-svg-icons/faSortDesc';
import { faSpinner } from '@fortawesome/pro-regular-svg-icons/faSpinner';
import { faStar } from '@fortawesome/pro-regular-svg-icons/faStar';
import { faStickyNote } from '@fortawesome/pro-regular-svg-icons/faStickyNote';
import { faStopwatch } from '@fortawesome/pro-regular-svg-icons/faStopwatch';
import { faStoreAlt } from '@fortawesome/pro-regular-svg-icons/faStoreAlt';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import { faTasks } from '@fortawesome/pro-regular-svg-icons/faTasks';
import { faThLarge } from '@fortawesome/pro-regular-svg-icons/faThLarge';
import { faThumbsUp } from '@fortawesome/pro-regular-svg-icons/faThumbsUp';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { faTimesCircle } from '@fortawesome/pro-regular-svg-icons/faTimesCircle';
import { faTrashAlt } from '@fortawesome/pro-regular-svg-icons/faTrashAlt';
import { faUniversity } from '@fortawesome/pro-regular-svg-icons/faUniversity';
import { faUsdCircle } from '@fortawesome/pro-regular-svg-icons/faUsdCircle';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import { faUserHardHat } from '@fortawesome/pro-regular-svg-icons/faUserHardHat';
import { faWallet } from '@fortawesome/pro-regular-svg-icons/faWallet';
import { faWrench } from '@fortawesome/pro-regular-svg-icons/faWrench';
import { faCaretRight } from '@fortawesome/pro-solid-svg-icons/faCaretRight';
import { faCircleQuestion as fasCircleQuestion } from '@fortawesome/pro-solid-svg-icons/faCircleQuestion';
import { faExclamationTriangle as fasExclamationTriangle } from '@fortawesome/pro-solid-svg-icons/faExclamationTriangle';
import { faFilter as fasFilter } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { faMoneyCheck as fasMoneyCheck } from '@fortawesome/pro-solid-svg-icons/faMoneyCheck';
import { faPlusCircle as fasPlusCircle } from '@fortawesome/pro-solid-svg-icons/faPlusCircle';
import { faTimesCircle as fasTimesCircle } from '@fortawesome/pro-solid-svg-icons/faTimesCircle';

// far prefix icons - <FontAwesomeIcon icon={['far', 'address-book']} />
library.add(
  faAddressBook,
  faArrowCircleUp,
  faBadgeDollar,
  faBan,
  faBars,
  faBath,
  faBed,
  faBullseye,
  faCalculator,
  faCalendarAlt,
  faCamera,
  faCar,
  faCcMastercard,
  faCcVisa,
  faChartBar,
  faChartPie,
  faCheck,
  faCheckCircle,
  fasCheckCircle,
  faChevronDoubleDown,
  faChevronDoubleRight,
  faChevronDoubleUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faClipboardCheck,
  faClipboardList,
  faCircle,
  faCircleQuestion,
  farCircle,
  faClock,
  faCloudDownload,
  faCloudUpload,
  faCog,
  faCogs,
  faComment,
  faCommentDollar,
  faCreditCardFront,
  faDollarSign,
  faDownload,
  faEdit,
  faEllipsisH,
  faEnvelope,
  faExchange,
  faExclamation,
  faExclamationCircle,
  faExclamationTriangle,
  faEye,
  faFileChartPie,
  faFileDownload,
  faFileImage,
  faFileInvoiceDollar,
  faFileLines,
  faFilePdf,
  faFileSignature,
  faFileVideo,
  faFlag,
  faHand,
  faHandHoldingUsd,
  faHammer,
  faHistory,
  faHome,
  falCircleQuestion,
  faList,
  faListUl,
  faLock,
  faLockOpen,
  faLongArrowRight,
  falAddressBook,
  falCircleCheck,
  falFileInvoiceDollar,
  falHammer,
  falScrewdriverWrench,
  falShop,
  faPaperPlane,
  faPencil,
  faPhone,
  faPlusCircle,
  faPrint,
  faScrewdriverWrench,
  faSearch,
  faSnooze,
  faSort,
  faSortAsc,
  faMoneyBillTransfer,
  faSortDesc,
  faSpinner,
  fasStar,
  faStar,
  faStopwatch,
  faStoreAlt,
  faStickyNote,
  faSyncAlt,
  faTasks,
  faThLarge,
  faThumbsUp,
  faTimes,
  faTimesCircle,
  faTrashAlt,
  faUniversity,
  faUsdCircle,
  faUser,
  faUserHardHat,
  faWallet,
  faWrench,
  faBell,
  faCaretRight,
  faExpand,
  farFilter,
  fasFilter,
  faArrowRight,
  fasCheck,
  fasTimesCircle,
  fasPlusCircle,
  faMoneyCheckAlt,
  fasMoneyCheck,
  fasExclamationTriangle,
  fasCircleQuestion,
  faSortUp,
  faSortDown,
  fadSort
);
