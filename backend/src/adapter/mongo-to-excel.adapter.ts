import { Responses } from "src/responses/responses.schema";
import { DataAdapter } from "./data.adapter.interface";
import * as ExcelJS from 'exceljs';
export class MongoToExcelAdapter implements DataAdapter{
    convertToReport(data: Responses[]):any {
        if(!data || data.length===0){
            throw new Error('No Responses data available to generate report.');
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Analytics Sheet");
        worksheet.columns=[
            {header:'User Name', key:'username', width:30},
            {header:"Score", key:"score", width:30},
            {header:'Course Code', key:'corsecode', width:30},
        ];

        data.forEach(Responses => {
            worksheet.addRow({
                username:Responses.username,
                score:Responses.score,
                corsecode:Responses.course_code
            });
        });
        return workbook.xlsx.writeBuffer();
    }

}