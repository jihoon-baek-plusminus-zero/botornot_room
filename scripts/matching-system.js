/**
 * Bot or Not Room 매치메이킹 시스템 (로컬스토리지 기반)
 * 대기열 관리 및 자동 매칭 기능 - 탭 간 공유
 */

class MatchingSystem {
    constructor() {
        // 대기열 (FIFO 방식) - 로컬스토리지에서 로드
        this.waitingQueue = this.loadQueueFromStorage();
        
        // 활성 방 목록 - 로컬스토리지에서 로드
        this.activeRooms = new Map(this.loadRoomsFromStorage());
        
        // 매칭 상태
        this.isMatching = false;
        
        // 매칭 간격 (밀리초)
        this.matchingInterval = 1000;
        
        // 매칭 타이머
        this.matchingTimer = null;
        
        // 시스템 시작 시간
        this.startTime = Date.now();
        
        console.log('로컬스토리지 기반 매치메이킹 시스템이 초기화되었습니다.');
        console.log('현재 대기열 상태:', this.waitingQueue.length, '명');
        
        // 매칭 프로세스 시작
        this.startMatchingProcess();
        
        // 다른 탭의 변경사항 감지
        this.setupStorageListener();
    }
    
    /**
     * 로컬스토리지에서 대기열 로드
     */
    loadQueueFromStorage() {
        try {
            const stored = localStorage.getItem('botornot_waiting_queue');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('대기열 로드 실패:', error);
            return [];
        }
    }
    
    /**
     * 로컬스토리지에서 방 정보 로드
     */
    loadRoomsFromStorage() {
        try {
            const stored = localStorage.getItem('botornot_active_rooms');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('방 정보 로드 실패:', error);
            return [];
        }
    }
    
    /**
     * 대기열을 로컬스토리지에 저장
     */
    saveQueueToStorage() {
        try {
            localStorage.setItem('botornot_waiting_queue', JSON.stringify(this.waitingQueue));
            // 다른 탭에 변경 알림
            this.notifyStorageChange('queue');
        } catch (error) {
            console.error('대기열 저장 실패:', error);
        }
    }
    
    /**
     * 방 정보를 로컬스토리지에 저장
     */
    saveRoomsToStorage() {
        try {
            const roomsArray = Array.from(this.activeRooms.entries());
            localStorage.setItem('botornot_active_rooms', JSON.stringify(roomsArray));
            // 다른 탭에 변경 알림
            this.notifyStorageChange('rooms');
        } catch (error) {
            console.error('방 정보 저장 실패:', error);
        }
    }
    
    /**
     * 다른 탭에 스토리지 변경 알림
     */
    notifyStorageChange(type) {
        const event = new StorageEvent('storage', {
            key: `botornot_${type}`,
            newValue: localStorage.getItem(`botornot_${type}`),
            oldValue: null,
            storageArea: localStorage
        });
        window.dispatchEvent(event);
    }
    
    /**
     * 다른 탭의 스토리지 변경 감지
     */
    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'botornot_queue') {
                console.log('다른 탭에서 대기열이 변경되었습니다.');
                this.waitingQueue = this.loadQueueFromStorage();
            } else if (event.key === 'botornot_rooms') {
                console.log('다른 탭에서 방 정보가 변경되었습니다.');
                this.activeRooms = new Map(this.loadRoomsFromStorage());
            } else if (event.key === 'botornot_match_complete') {
                console.log('다른 탭에서 매칭 완료 이벤트가 발생했습니다.');
                // 매칭 완료 상태 확인
                this.checkUserMatchStatus();
            }
        });
    }
    
    /**
     * 사용자를 대기열에 추가
     * @param {Object} user - 사용자 정보
     * @returns {number} 대기열 위치
     */
    addToQueue(user) {
        const userInfo = {
            id: user.id || this.generateUserId(),
            name: user.name || '익명',
            joinTime: Date.now(),
            status: 'waiting',
            tabId: this.generateTabId()
        };
        
        this.waitingQueue.push(userInfo);
        console.log(`사용자 ${userInfo.name}이(가) 대기열에 추가되었습니다. (위치: ${this.waitingQueue.length})`);
        
        // 로컬스토리지에 저장
        this.saveQueueToStorage();
        
        return this.waitingQueue.length;
    }
    
    /**
     * 사용자를 대기열에서 제거
     * @param {string} userId - 사용자 ID
     * @returns {boolean} 제거 성공 여부
     */
    removeFromQueue(userId) {
        const index = this.waitingQueue.findIndex(user => user.id === userId);
        if (index !== -1) {
            const removedUser = this.waitingQueue.splice(index, 1)[0];
            console.log(`사용자 ${removedUser.name}이(가) 대기열에서 제거되었습니다.`);
            
            // 로컬스토리지에 저장
            this.saveQueueToStorage();
            return true;
        }
        return false;
    }
    
    /**
     * 대기열 상태 조회
     * @returns {Object} 대기열 정보
     */
    getQueueStatus() {
        return {
            totalWaiting: this.waitingQueue.length,
            estimatedWaitTime: this.calculateEstimatedWaitTime(),
            queue: this.waitingQueue.map((user, index) => ({
                position: index + 1,
                name: user.name,
                joinTime: user.joinTime,
                tabId: user.tabId
            }))
        };
    }
    
    /**
     * 예상 대기 시간 계산
     * @returns {string} 예상 대기 시간
     */
    calculateEstimatedWaitTime() {
        const queueLength = this.waitingQueue.length;
        if (queueLength === 0) return '즉시';
        if (queueLength === 1) return '1-2분';
        
        const estimatedMinutes = Math.ceil(queueLength / 2);
        return `${estimatedMinutes}-${estimatedMinutes + 1}분`;
    }
    
    /**
     * 매칭 프로세스 시작
     */
    startMatchingProcess() {
        if (this.matchingTimer) {
            clearInterval(this.matchingTimer);
        }
        
        this.matchingTimer = setInterval(() => {
            this.processMatching();
        }, this.matchingInterval);
        
        console.log('매칭 프로세스가 시작되었습니다.');
    }
    
    /**
     * 매칭 처리
     */
    processMatching() {
        if (this.waitingQueue.length < 2) {
            return; // 2명 미만이면 매칭 불가
        }
        
        console.log(`매칭 시도: 대기열 ${this.waitingQueue.length}명`);
        
        // 2명씩 순서대로 매칭
        while (this.waitingQueue.length >= 2) {
            const user1 = this.waitingQueue.shift();
            const user2 = this.waitingQueue.shift();
            
            // 매칭 생성
            const match = this.createMatch(user1, user2);
            
            if (match) {
                console.log(`매칭 완료: ${user1.name} + ${user2.name} → 방 ${match.roomId}`);
                
                // 매칭된 사용자들에게 알림
                this.notifyMatch(user1, match);
                this.notifyMatch(user2, match);
            }
        }
        
        // 대기열 상태 저장
        this.saveQueueToStorage();
    }
    
    /**
     * 매칭 생성
     * @param {Object} user1 - 첫 번째 사용자
     * @param {Object} user2 - 두 번째 사용자
     * @returns {Object} 매칭 정보
     */
    createMatch(user1, user2) {
        const roomId = this.generateRoomId();
        const matchTime = Date.now();
        
        const match = {
            roomId: roomId,
            users: [user1, user2],
            matchTime: matchTime,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        // 방 정보 저장
        this.activeRooms.set(roomId, match);
        this.saveRoomsToStorage();
        
        // 사용자 상태 업데이트
        user1.status = 'matched';
        user1.roomId = roomId;
        user2.status = 'matched';
        user2.roomId = roomId;
        
        return match;
    }
    
    /**
     * 매칭 완료 알림
     * @param {Object} user - 사용자
     * @param {Object} match - 매칭 정보
     */
    notifyMatch(user, match) {
        console.log(`사용자 ${user.name}에게 매칭 알림:`, {
            roomId: match.roomId,
            partner: match.users.find(u => u.id !== user.id)?.name,
            matchTime: match.matchTime
        });
        
        // 매칭 완료 상태를 localStorage에 저장 (다른 탭에서 감지 가능)
        const matchCompleteKey = `botornot_match_complete_${user.id}`;
        const matchData = {
            roomId: match.roomId,
            matchTime: match.matchTime,
            timestamp: Date.now(),
            userId: user.id,
            userName: user.name
        };
        localStorage.setItem(matchCompleteKey, JSON.stringify(matchData));
        
        // 다른 탭에 매칭 완료 알림
        this.notifyStorageChange('match_complete');
        
        // 현재 페이지가 대기방인 경우에만 리다이렉트
        if (window.location.href.includes('waiting-room')) {
            console.log(`매칭 완료! ${redirectUrl}로 이동합니다.`);
            const redirectUrl = `match-complete.html?roomId=${match.roomId}&matchTime=${match.matchTime}`;
            window.location.href = redirectUrl;
        }
    }
    
    /**
     * 방 ID 생성
     * @returns {string} 고유한 방 ID
     */
    generateRoomId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    /**
     * 사용자 ID 생성
     * @returns {string} 고유한 사용자 ID
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * 탭 ID 생성
     * @returns {string} 고유한 탭 ID
     */
    generateTabId() {
        return 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * 사용자 매칭 상태 확인
     */
    checkUserMatchStatus() {
        // 현재 사용자 정보가 있는지 확인 (대기방에서만 실행)
        if (typeof window.currentUser !== 'undefined' && window.currentUser) {
            const matchCompleteKey = `botornot_match_complete_${window.currentUser.id}`;
            const matchData = localStorage.getItem(matchCompleteKey);
            
            if (matchData) {
                try {
                    const match = JSON.parse(matchData);
                    console.log('사용자 매칭 완료 감지:', match);
                    
                    // 매칭 완료 페이지로 리다이렉트
                    const redirectUrl = `match-complete.html?roomId=${match.roomId}&matchTime=${match.matchTime}`;
                    console.log(`매칭 완료! ${redirectUrl}로 이동합니다.`);
                    window.location.href = redirectUrl;
                    
                    // 매칭 완료 데이터 정리
                    localStorage.removeItem(matchCompleteKey);
                } catch (error) {
                    console.error('매칭 데이터 파싱 오류:', error);
                }
            }
        }
    }
    
    /**
     * 방 정보 조회
     * @param {string} roomId - 방 ID
     * @returns {Object} 방 정보
     */
    getRoomInfo(roomId) {
        return this.activeRooms.get(roomId);
    }
    
    /**
     * 활성 방 목록 조회
     * @returns {Array} 활성 방 목록
     */
    getActiveRooms() {
        return Array.from(this.activeRooms.values());
    }
    
    /**
     * 매칭 시스템 상태 조회
     * @returns {Object} 시스템 상태
     */
    getSystemStatus() {
        return {
            waitingUsers: this.waitingQueue.length,
            activeRooms: this.activeRooms.size,
            isMatching: this.isMatching,
            uptime: Date.now() - this.startTime
        };
    }
    
    /**
     * 매칭 시스템 중지
     */
    stop() {
        if (this.matchingTimer) {
            clearInterval(this.matchingTimer);
            this.matchingTimer = null;
        }
        this.isMatching = false;
        console.log('매칭 시스템이 중지되었습니다.');
    }
}

// 전역 매치메이킹 시스템 인스턴스 생성
window.matchingSystem = new MatchingSystem();

// 전역 함수로 노출 (다른 스크립트에서 사용)
window.addToMatchingQueue = function(user) {
    return window.matchingSystem.addToQueue(user);
};

window.removeFromMatchingQueue = function(userId) {
    return window.matchingSystem.removeFromQueue(userId);
};

window.getMatchingQueueStatus = function() {
    return window.matchingSystem.getQueueStatus();
};
