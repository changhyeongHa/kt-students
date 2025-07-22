const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 계산기 함수들
const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) {
      throw new Error('0으로 나눌 수 없습니다.');
    }
    return a / b;
  },
  power: (a, b) => Math.pow(a, b),
  sqrt: (a) => {
    if (a < 0) {
      throw new Error('음수의 제곱근은 계산할 수 없습니다.');
    }
    return Math.sqrt(a);
  },
  percentage: (a, b) => (a * b) / 100
};

// API 라우트
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '계산기 서비스가 정상적으로 작동 중입니다.' });
});

app.post('/api/calculate', (req, res) => {
  try {
    const { operation, a, b } = req.body;
    
    if (!operation || a === undefined || b === undefined) {
      return res.status(400).json({ 
        error: '필수 파라미터가 누락되었습니다. operation, a, b가 필요합니다.' 
      });
    }

    let result;
    switch (operation) {
      case 'add':
        result = calculator.add(Number(a), Number(b));
        break;
      case 'subtract':
        result = calculator.subtract(Number(a), Number(b));
        break;
      case 'multiply':
        result = calculator.multiply(Number(a), Number(b));
        break;
      case 'divide':
        result = calculator.divide(Number(a), Number(b));
        break;
      case 'power':
        result = calculator.power(Number(a), Number(b));
        break;
      case 'percentage':
        result = calculator.percentage(Number(a), Number(b));
        break;
      default:
        return res.status(400).json({ error: '지원하지 않는 연산입니다.' });
    }

    res.json({
      operation,
      a: Number(a),
      b: Number(b),
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 단일 숫자 연산 (제곱근)
app.post('/api/calculate/single', (req, res) => {
  try {
    const { operation, a } = req.body;
    
    if (!operation || a === undefined) {
      return res.status(400).json({ 
        error: '필수 파라미터가 누락되었습니다. operation, a가 필요합니다.' 
      });
    }

    let result;
    switch (operation) {
      case 'sqrt':
        result = calculator.sqrt(Number(a));
        break;
      default:
        return res.status(400).json({ error: '지원하지 않는 연산입니다.' });
    }

    res.json({
      operation,
      a: Number(a),
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`계산기 서비스가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`http://localhost:${PORT}`);
  console.log('서버가 성공적으로 시작되었습니다!');
});

// 에러 핸들링
process.on('uncaughtException', (err) => {
  console.error('예상치 못한 오류:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('처리되지 않은 Promise 거부:', reason);
}); 