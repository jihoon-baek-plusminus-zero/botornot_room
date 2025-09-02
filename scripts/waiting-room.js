// 전역 변수 선언
let currentUser = null;

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('1:1 대기방이 로드되었습니다.');
    
    // 요소들 가져오기
    const cancelMatchingBtn = document.getElementById('cancelMatchingBtn');
    
    // 대기 상태 초기화
    let isWaiting = true;
    
    // 사용자 정보 생성 및 대기열에 추가
    initializeUser();
    
    // 매칭 취소 버튼 클릭 이벤트
    cancelMatchingBtn.addEventListener('click', function() {
        console.log('매칭 취소 요청됨');
        cancelMatching();
    });
    
    // ESC 키로 매칭 취소
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cancelMatching();
        }
    });
    
    // 페이지 언로드 시 대기열에서 제거
    window.addEventListener('beforeunload', function() {
        if (currentUser && isWaiting) {
            window.matchingSystem.removeFromQueue(currentUser.id);
        }
    });
});

/**
 * 사용자 초기화 및 대기열 추가
 */
function initializeUser() {
    try {
        // 사용자 정보 생성
        currentUser = {
            id: generateUserId(),
            name: generateUserName(),
            joinTime: Date.now(),
            tabId: generateTabId()
        };
        
        console.log('사용자 정보:', currentUser);
        
        // 사용자 상태를 'waiting'으로 설정
        localStorage.setItem(`botornot_user_${currentUser.id}_status`, 'waiting');
        console.log('✅ 사용자 상태를 "waiting"으로 설정했습니다.');
        
        // 현재 사용자를 전역으로 노출 (매칭 시스템에서 접근 가능)
        window.currentUser = currentUser;
        console.log('✅ 전역에 사용자 정보를 설정했습니다.');
        
        // 매치메이킹 시스템의 대기열에 추가
        if (window.matchingSystem) {
            const queuePosition = window.matchingSystem.addToQueue(currentUser);
            console.log(`대기열에 추가되었습니다. (위치: ${queuePosition})`);
            
            // 통합 모니터링 시스템 시작 (사용자 정보 설정 후)
            startUnifiedMonitoring();
            console.log('✅ 모니터링 시스템을 시작했습니다.');
        } else {
            console.error('매치메이킹 시스템을 찾을 수 없습니다.');
            // 3초 후 재시도
            setTimeout(() => {
                if (window.matchingSystem) {
                    console.log('매치메이킹 시스템 재시도 중...');
                    initializeUser();
                }
            }, 3000);
        }
    } catch (error) {
        console.error('사용자 초기화 중 오류 발생:', error);
    }
}

/**
 * 통합 모니터링 시스템
 */
function startUnifiedMonitoring() {
    console.log('🔍 통합 모니터링 시스템 시작...');
    
    const monitorInterval = setInterval(() => {
        try {
            // 사용자 정보 확인
            if (!currentUser) {
                console.log('⏹️ 모니터링 중단: 사용자 정보 없음');
                clearInterval(monitorInterval);
                return;
            }
            
            // 사용자 상태 확인 (localStorage 기반)
            const userStatus = localStorage.getItem(`botornot_user_${currentUser.id}_status`);
            if (userStatus !== 'waiting') {
                console.log('⏹️ 모니터링 중단: 사용자 상태 변경됨', userStatus);
                clearInterval(monitorInterval);
                return;
            }
            
            // 매칭 완료 데이터 확인
            const matchCompleteKey = `botornot_match_complete_${currentUser.id}`;
            const matchData = localStorage.getItem(matchCompleteKey);
            
            if (matchData) {
                console.log('🎯 매칭 완료 데이터 발견:', matchData);
                clearInterval(monitorInterval);
                
                try {
                    const match = JSON.parse(matchData);
                    console.log('✅ 매칭 완료 데이터 파싱 성공:', match);
                    
                    // 매칭 완료 페이지로 이동
                    const redirectUrl = `match-complete.html?roomId=${match.roomId}&matchTime=${match.matchTime}`;
                    console.log(`🚀 매칭 완료! ${redirectUrl}로 이동합니다.`);
                    
                    // 데이터 정리
                    localStorage.removeItem(matchCompleteKey);
                    localStorage.setItem(`botornot_user_${currentUser.id}_status`, 'matched');
                    console.log('🧹 매칭 완료 데이터 정리 및 상태 업데이트 완료');
                    
                    // 페이지 이동
                    window.location.href = redirectUrl;
                } catch (error) {
                    console.error('❌ 매칭 데이터 파싱 오류:', error);
                }
            } else {
                console.log('⏳ 아직 매칭 완료 데이터가 없습니다. 계속 대기...');
            }
        } catch (error) {
            console.error('❌ 모니터링 중 오류 발생:', error);
            // 에러가 발생해도 모니터링은 계속 진행
        }
    }, 1000); // 1초마다 확인
}

/**
 * 매칭 취소 함수
 */
function cancelMatching() {
    if (confirm('정말로 매칭을 취소하시겠습니까?')) {
        try {
            console.log('매칭이 취소되었습니다.');
            
            // 대기열에서 사용자 제거
            if (currentUser && window.matchingSystem) {
                window.matchingSystem.removeFromQueue(currentUser.id);
                console.log('✅ 대기열에서 사용자를 제거했습니다.');
            }
            
            // 사용자 상태 정리
            localStorage.removeItem(`botornot_user_${currentUser.id}_status`);
            console.log('✅ 사용자 상태를 정리했습니다.');
            
            // 메인 페이지로 리다이렉트
            window.location.href = 'index.html';
        } catch (error) {
            console.error('매칭 취소 중 오류 발생:', error);
            // 에러가 발생해도 메인 페이지로 이동
            window.location.href = 'index.html';
        }
    }
}

/**
 * 사용자 ID 생성
 */
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 사용자 이름 생성
 */
function generateUserName() {
    const adjectives = ['즐거운', '신나는', '재미있는', '특별한', '멋진', '아름다운', '훌륭한', '완벽한'];
    const nouns = ['사람', '친구', '동료', '파트너', '메이트', '컴패니언'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return randomAdjective + randomNoun;
}

/**
 * 탭 ID 생성
 */
function generateTabId() {
    return 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}



/**
 * 페이지 가시성 변경 감지
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('페이지가 숨겨졌습니다.');
        // TODO: 백그라운드 처리 로직
    } else {
        console.log('페이지가 다시 활성화되었습니다.');
        // TODO: 포그라운드 처리 로직
    }
});

/**
 * 에러 핸들링
 */
window.addEventListener('error', function(e) {
    console.error('대기방 에러 발생:', e.error);
});

/**
 * 온라인/오프라인 상태 모니터링
 */
window.addEventListener('online', function() {
    console.log('인터넷 연결이 복구되었습니다.');
});

window.addEventListener('offline', function() {
    console.log('인터넷 연결이 끊어졌습니다.');
});
