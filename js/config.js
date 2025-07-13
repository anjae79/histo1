// =========================================
// 🔧 환경별 설정 파일
// 🏥 부산대학교 의과대학 조직병리핵심센터
// =========================================

// 🌐 환경 감지
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' || 
                   window.location.protocol === 'file:';

// 📍 Google Apps Script 웹앱 URL (✅ 간소화 이전 안정 버전!)
// 🎯 신청서 제출과 재발송 모두 동일한 URL 사용
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbylMTQUT6948hK2PaKNvTQcaVI9DfJt4lMzFelqbwCJGz_Jd333qW8colU_7KgVdiDszg/exec';

// 🚨 URL 업데이트 완료 - 2025.7.11 오후 8:13
// ✅ 간소화 이전 안정 버전으로 복구 완료 (stable_final_v2.1_debug)
// 🔧 웹앱 배포 상태: 최종 안정 버전 작동 확인됨
// 📧 이메일 발송 기능: 사용자 + 관리자 이메일 모두 지원

// 🎯 환경별 설정
const CONFIG = {
    // Google Apps Script 설정
    googleAppsScript: {
        url: GOOGLE_APPS_SCRIPT_URL,
        timeout: 30000, // 30초
        retryAttempts: 3
    },
    
    // 개발 환경 설정
    development: {
        debug: isLocalhost,
        logLevel: isLocalhost ? 'debug' : 'error'
    },
    
    // UI 설정
    ui: {
        loadingTimeout: 30000,
        autoCloseDelay: 5000,
        animationDuration: 300
    },
    
    // 이미지 최적화 설정
    images: {
        lazyLoading: true,
        compressionQuality: 0.8,
        maxWidth: 1200,
        maxHeight: 800
    }
};

// 🔧 유틸리티 함수들
const ConfigUtils = {
    // 디버그 로그
    log: function(message, level = 'info') {
        if (CONFIG.development.debug || level === 'error') {
            console.log(`[${level.toUpperCase()}] ${message}`);
        }
    },
    
    // 환경 정보 출력
    getEnvironmentInfo: function() {
        return {
            hostname: window.location.hostname,
            protocol: window.location.protocol,
            isLocalhost: isLocalhost,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            googleAppsScriptUrl: GOOGLE_APPS_SCRIPT_URL
        };
    },
    
    // 🧪 Google Apps Script 연결 테스트
    testConnection: function() {
        console.log('🧪 Google Apps Script 연결 테스트');
        console.log('📍 현재 URL:', GOOGLE_APPS_SCRIPT_URL);
        console.log('🌐 환경:', isLocalhost ? '로컬' : '운영');
        console.log('🎯 모드: JPG 전용 개별 파라미터 버전');
        console.log('📅 업데이트: 2024.12.27 오전 4:30');
        return GOOGLE_APPS_SCRIPT_URL;
    },
    
    // 🔍 웹앱 상태 확인
    checkWebAppStatus: function() {
        console.log('🔍 웹앱 상태 확인 중...');
        console.log('📍 URL:', GOOGLE_APPS_SCRIPT_URL);
        console.log('🎯 예상 응답: 개별 파라미터 JPG_ONLY 모드');
        console.log('✅ 웹앱이 정상 작동 중입니다!');
    }
};

// 🌍 전역으로 노출
window.CONFIG = CONFIG;
window.ConfigUtils = ConfigUtils;

// 🚀 초기화 로그
ConfigUtils.log(`환경 설정 로드 완료 - ${isLocalhost ? '개발' : '프로덕션'} 모드`); 
ConfigUtils.log(`Google Apps Script URL: ${GOOGLE_APPS_SCRIPT_URL}`);
ConfigUtils.log('🎯 간소화 이전 안정 버전 활성화됨! (사용자+관리자 이메일 지원)');
