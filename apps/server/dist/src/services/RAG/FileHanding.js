"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFileToText = void 0;
const tesseract_js_1 = require("tesseract.js");
const fs = __importStar(require("fs"));
const XLSX = __importStar(require("xlsx"));
const PDFParser = require("pdf-parse");
function convertFileToText(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileExtension = file.mimetype.split("/")[1];
        console.log("file type : ", fileExtension);
        if (fileExtension === "pdf") {
            return yield convertPdfToText(file);
        }
        else if (TextFormats.includes(fileExtension)) {
            return yield readTextFile(file);
        }
        else if (ExcelFormats.includes(fileExtension)) {
            return yield extractTextFromExcel(file);
        }
        else if (ImageFormats.includes(fileExtension)) {
            return yield extractTextFromImage(file);
        }
        else {
            throw Error("Unsupported File Type");
        }
    });
}
exports.convertFileToText = convertFileToText;
const convertPdfToText = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const pdfBuffer = fs.readFileSync(file.path);
    const pdfText = yield PDFParser(pdfBuffer);
    return pdfText.text;
});
const readTextFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return fs.readFileSync(file.path, "utf8");
});
const extractTextFromExcel = (file) => __awaiter(void 0, void 0, void 0, function* () {
    XLSX.set_fs(fs);
    try {
        // Read the Excel file
        const workbook = XLSX.readFile(file.path);
        let text = "";
        // Process each sheet in the workbook
        workbook.SheetNames.forEach((sheetName) => {
            // Convert each sheet to text
            const worksheet = workbook.Sheets[sheetName];
            const sheetText = XLSX.utils.sheet_to_csv(worksheet);
            text += sheetText + "\n";
        });
        return text;
    }
    catch (err) {
        console.error("Error converting Excel to text:", err);
        throw err;
    }
});
const extractTextFromImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const worker = yield (0, tesseract_js_1.createWorker)("eng");
    const ret = yield worker.recognize(file.path);
    yield worker.terminate();
    const output = ret.data.text;
    console.log(output);
    return output;
});
// ------- FORMATS ----------------------------
const ExcelFormats = [
    "xls",
    "xlsx",
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
];
const ImageFormats = ["jpg", "jpeg", "png"];
const TextFormats = ["csv", "plain"];
