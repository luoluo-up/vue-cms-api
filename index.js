import dotenv from 'dotenv'; //环境变量配置，非必须
dotenv.config();
import cors from 'cors'; //跨域配置
import express from 'express'; //引入express
const app = express();
app.use(cors());

const port =  3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
export default app
