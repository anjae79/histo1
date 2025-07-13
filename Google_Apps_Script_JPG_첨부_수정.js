// =========================================
// 🏥 부산대학교 의과대학 조직병리코어센터
// 📧 신청서 이메일 발송 시스템 (JPG 첨부 수정 버전)
// =========================================

function doPost(e) {
  try {
    console.log('📨 POST 요청 수신됨');
    
    // 🔍 요청 데이터 확인
    const params = e.parameter;
    console.log('📋 받은 파라미터:', Object.keys(params));
    
    // 📧 기본 정보 추출
    const receiptNumber = params.receiptNumber || 'PNU-' + Date.now();
    const name = params.name || '미입력';
    const institution = params.institution || '미입력';
    const department = params.department || '미입력';
    const email = params.email || '';
    const phone = params.phone || '미입력';
    const sampleName = params.sampleName || '미입력';
    const specialRequests = params.specialRequests || '없음';
    
    console.log('👤 신청자:', name);
    console.log('📧 이메일:', email);
    console.log('📋 접수번호:', receiptNumber);
    
    // 🎯 JPG 이미지 데이터 확인 및 처리
    let jpgAttachment = null;
    const jpgBase64 = params.applicationImageJPG;
    const jpgFilename = params.applicationImageFilename || `신청서_${receiptNumber}.jpg`;
    const hasJPGImage = params.hasJPGImage === 'true';
    
    console.log('📸 JPG 이미지 상태:');
    console.log('  hasJPGImage:', hasJPGImage);
    console.log('  jpgBase64 있음:', !!jpgBase64);
    console.log('  jpgFilename:', jpgFilename);
    
    if (hasJPGImage && jpgBase64) {
      try {
        console.log('🔄 JPG base64를 Blob으로 변환 중...');
        
        // Base64 데이터를 Blob으로 변환
        const jpgBlob = Utilities.newBlob(
          Utilities.base64Decode(jpgBase64), 
          'image/jpeg', 
          jpgFilename
        );
        
        jpgAttachment = jpgBlob;
        console.log('✅ JPG 첨부파일 준비 완료:', jpgFilename);
        console.log('📊 JPG 파일 크기:', jpgBlob.getBytes().length, 'bytes');
        
      } catch (jpgError) {
        console.error('❌ JPG 처리 오류:', jpgError.toString());
        // JPG 처리 실패해도 텍스트 이메일은 발송
      }
    } else {
      console.log('⚠️ JPG 이미지 없음 - 텍스트만 발송');
    }
    
    // 📝 이메일 제목과 본문 생성
    const emailSubject = `[신청접수] 조직병리코어센터 서비스 신청 - ${name} (${receiptNumber})`;
    
    const emailBody = `부산대학교 의과대학 조직병리코어센터 서비스 신청서

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 접수번호: ${receiptNumber}
📅 신청일시: ${new Date().toLocaleString('ko-KR')}

■ 신청자 정보
👤 신청자: ${name}
🏢 소속기관: ${institution}
🏛️ 부서/학과: ${department}
📧 이메일: ${email}
📞 연락처: ${phone}

■ 검체 정보  
🧪 검체명: ${sampleName}
🔬 검체 종류: ${params.sampleTypes || '미선택'}
⚗️ 고정액: ${params.fixatives || '미선택'}

■ 특별 요청사항
${specialRequests}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📎 첨부파일: ${jpgAttachment ? '신청서 JPG 이미지' : '첨부파일 없음'}

부산대학교 의과대학 조직병리코어센터
📞 전화: 051-510-8057, 8525
📧 이메일: histopath.pnu@gmail.com`;

    // 📧 이메일 발송 옵션 설정
    const emailOptions = {
      name: '부산대학교 의과대학 조직병리코어센터',
      subject: emailSubject,
      htmlBody: emailBody.replace(/\n/g, '<br>'),
      replyTo: 'histopath.pnu@gmail.com'
    };
    
    // 🎯 JPG 첨부파일이 있으면 추가
    if (jpgAttachment) {
      emailOptions.attachments = [jpgAttachment];
      console.log('📎 JPG 첨부파일 추가됨');
    }
    
    // 📧 센터 관리자에게 이메일 발송
    console.log('📧 센터 관리자에게 이메일 발송 중...');
    GmailApp.sendEmail(
      'histopath.pnu@gmail.com',
      emailSubject,
      emailBody,
      emailOptions
    );
    console.log('✅ 센터 관리자 이메일 발송 완료');
    
    // 📧 신청자에게 확인 이메일 발송
    if (email && email.includes('@')) {
      console.log('📧 신청자에게 확인 이메일 발송 중...');
      
      const confirmSubject = `[접수확인] 조직병리코어센터 서비스 신청이 완료되었습니다 (${receiptNumber})`;
      const confirmBody = `안녕하세요, ${name}님.

조직병리코어센터 서비스 신청이 정상적으로 접수되었습니다.

${emailBody}

접수된 신청서를 검토한 후 연락드리겠습니다.
문의사항이 있으시면 언제든 연락 주세요.

감사합니다.

부산대학교 의과대학 조직병리코어센터
📞 전화: 051-510-8057, 8525
📧 이메일: histopath.pnu@gmail.com`;

      const confirmOptions = {
        name: '부산대학교 의과대학 조직병리코어센터',
        subject: confirmSubject,
        htmlBody: confirmBody.replace(/\n/g, '<br>'),
        replyTo: 'histopath.pnu@gmail.com'
      };
      
      // 🎯 신청자에게도 JPG 첨부파일 포함
      if (jpgAttachment) {
        confirmOptions.attachments = [jpgAttachment];
        console.log('📎 신청자에게도 JPG 첨부파일 포함');
      }
      
      GmailApp.sendEmail(email, confirmSubject, confirmBody, confirmOptions);
      console.log('✅ 신청자 확인 이메일 발송 완료');
    }
    
    // ✅ 성공 응답 반환
    const response = {
      success: true,
      receiptNumber: receiptNumber,
      message: jpgAttachment ? 
        'JPG 이미지가 포함된 신청서가 성공적으로 제출되었습니다.' : 
        '신청서가 성공적으로 제출되었습니다. (이미지 없음)',
      hasJPGImage: !!jpgAttachment,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ 처리 완료:', response);
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('❌ 오류 발생:', error.toString());
    
    const errorResponse = {
      success: false,
      error: error.toString(),
      message: '신청서 처리 중 오류가 발생했습니다.',
      timestamp: new Date().toISOString()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 🔧 GET 요청 처리 (테스트용)
function doGet(e) {
  const testResponse = {
    status: 'Google Apps Script 작동 중',
    message: 'JPG 이미지 첨부 지원',
    timestamp: new Date().toISOString(),
    version: '2024.12.27 JPG 첨부 수정'
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(testResponse))
    .setMimeType(ContentService.MimeType.JSON);
} 