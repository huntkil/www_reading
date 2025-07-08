const fs = require('fs');
const path = require('path');

const VAULT_ROOT = path.join(process.cwd(), 'SubvocalizationCoaching');

const structure = [
  '01-UserProfiles',
  '02-DailyLogs',
  '03-TrainingTexts/beginner',
  '03-TrainingTexts/intermediate',
  '03-TrainingTexts/advanced',
  '04-Analytics',
  '05-Templates',
];

const files = [
  {
    relPath: '01-UserProfiles/user-settings.md',
    content: '# 사용자 설정\n\n- 이름: \n- 목표: \n- 선호 학습 스타일: \n',
  },
  {
    relPath: '01-UserProfiles/learning-goals.md',
    content: '# 학습 목표\n\n- 단기 목표: \n- 중기 목표: \n- 장기 목표: \n',
  },
  {
    relPath: '04-Analytics/speed-tracking.md',
    content: '# 속도 추적\n\n| 날짜 | 읽기 속도(WPM) | 정확도(%) |\n|------|---------------|-----------|\n',
  },
  {
    relPath: '04-Analytics/progress-reports.md',
    content: '# 진행 보고서\n\n- 월간/주간 리포트 기록\n',
  },
  {
    relPath: '05-Templates/daily-session-template.md',
    content: `# 학습 세션 기록 - {{date}}\n\n## 세션 정보\n- **시작 시간**: \n- **종료 시간**: \n- **총 소요 시간**: \n- **연습 레벨**: \n\n## 성과 지표\n- **읽기 속도**:  WPM\n- **정확도**:  %\n- **이전 대비 개선**:  %\n\n## 사용한 기법\n- \n\n## 오늘의 느낀 점\n\n## 태그\n#속발음해결 #레벨 #{{date}}\n`,
  },
  {
    relPath: '05-Templates/progress-report-template.md',
    content: `# 월간 진행상황 보고서 - {{date}}\n\n## 📊 주요 지표\n- **평균 읽기 속도**:  WPM\n- **최고 기록**:  WPM\n- **총 연습 시간**:  분\n- **연습 일수**:  일\n\n## 📈 개선 추이\n- **속도 향상**:  % 증가\n- **일관성 지수**: /100\n\n## 🎯 다음 목표\n\n## 💡 개선 제안\n\n#진행보고서 #{{month}}\n`,
  },
];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log('폴더 생성:', dirPath);
  }
}

function writeFile(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('파일 생성:', filePath);
  }
}

function main() {
  ensureDir(VAULT_ROOT);
  structure.forEach((rel) => {
    ensureDir(path.join(VAULT_ROOT, rel));
  });
  files.forEach(({ relPath, content }) => {
    writeFile(path.join(VAULT_ROOT, relPath), content);
  });
  console.log('\n✅ Vault 구조가 성공적으로 생성되었습니다!');
}

if (require.main === module) {
  main();
}

// 사용법: node scripts/init-vault.js 