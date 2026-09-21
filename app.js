/**
 * 우리 아이 뇌의 사회성 인포그래픽 대시보드 - 인터랙티브 컨트롤러
 */

document.addEventListener('DOMContentLoaded', () => {
  initViewModes();
  initBreathPacer();
  initDecoderInteraction();
  initHormoneTabs();
  initChecklist();
});

/* ============================================================ */
/* 1. 뷰 모드 관리 (통합 대시보드 / 카드뉴스 슬라이드 / 인쇄)    */
/* ============================================================ */
let currentSlide = 1;
const totalSlides = 7;

function initViewModes() {
  const btnDashboard = document.getElementById('btn-view-dashboard');
  const btnSlides = document.getElementById('btn-view-slides');
  const btnPrint = document.getElementById('btn-print-cheatsheet');
  const savePrintBtn = document.getElementById('save-print-btn');
  const slideNavBar = document.getElementById('slide-nav-bar');
  const prevSlideBtn = document.getElementById('prev-slide-btn');
  const nextSlideBtn = document.getElementById('next-slide-btn');
  const slideDots = document.getElementById('slide-dots');
  const slideCounter = document.getElementById('slide-counter');
  const sections = document.querySelectorAll('.section-card');

  // 슬라이드 도트 생성
  slideDots.innerHTML = '';
  for (let i = 1; i <= totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = `slide-dot ${i === 1 ? 'active' : ''}`;
    dot.dataset.slide = i;
    dot.addEventListener('click', () => goToSlide(i));
    slideDots.appendChild(dot);
  }

  // 대시보드 모드 활성화
  function setDashboardMode() {
    document.body.classList.remove('mode-slides');
    btnDashboard.classList.add('active');
    btnSlides.classList.remove('active');
    slideNavBar.style.display = 'none';
    sections.forEach(s => s.classList.remove('active-slide'));
  }

  // 슬라이드 모드 활성화
  function setSlideMode() {
    document.body.classList.add('mode-slides');
    btnSlides.classList.add('active');
    btnDashboard.classList.remove('active');
    slideNavBar.style.display = 'flex';
    goToSlide(currentSlide);
  }

  function goToSlide(slideNum) {
    if (slideNum < 1) slideNum = 1;
    if (slideNum > totalSlides) slideNum = totalSlides;
    currentSlide = slideNum;

    sections.forEach(s => {
      if (parseInt(s.dataset.slide) === currentSlide) {
        s.classList.add('active-slide');
      } else {
        s.classList.remove('active-slide');
      }
    });

    // 도트 및 카운터 갱신
    document.querySelectorAll('.slide-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx + 1 === currentSlide);
    });
    slideCounter.textContent = `${currentSlide} / ${totalSlides}`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  btnDashboard.addEventListener('click', setDashboardMode);
  btnSlides.addEventListener('click', setSlideMode);

  prevSlideBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextSlideBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  // 키보드 좌우 화살표로 슬라이드 넘기기
  window.addEventListener('keydown', (e) => {
    if (document.body.classList.contains('mode-slides')) {
      if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
      if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
    }
  });

  // 인쇄 트리거
  const handlePrint = () => {
    const wasSlideMode = document.body.classList.contains('mode-slides');
    setDashboardMode(); // 인쇄 시에는 전체 내용 출력
    setTimeout(() => {
      window.print();
      if (wasSlideMode) setSlideMode();
    }, 200);
  };

  btnPrint.addEventListener('click', handlePrint);
  if (savePrintBtn) savePrintBtn.addEventListener('click', handlePrint);
}

/* ============================================================ */
/* 2. 생리적 긴 호흡 (Physiological Sigh) 애니메이션 페이서     */
/* ============================================================ */
function initBreathPacer() {
  const pacerCircle = document.getElementById('pacer-circle');
  const pacerText = document.getElementById('pacer-text');
  const toggleBtn = document.getElementById('pacer-toggle-btn');
  if (!pacerCircle || !toggleBtn) return;

  let isPacing = false;
  let pacerTimer = null;
  let step = 0;

  // 후버만 랩 권장 생리적 긴 호흡 주기:
  // 들숨 1 (깊게 2초) -> 들숨 2 (추가 들이마시기 1초) -> 긴 날숨 (후- 5초)
  const sequence = [
    { text: '코로 깊게\n들이마시기 (1/2)', className: 'inhale1', duration: 2200 },
    { text: '끝에서 한 번 더\n숨 채우기 (2/2)', className: 'inhale2', duration: 1200 },
    { text: '입으로 길게\n내쉬기 (후~)', className: 'exhale', duration: 5000 }
  ];

  function runStep() {
    if (!isPacing) return;
    const current = sequence[step];

    pacerCircle.className = `pacer-circle ${current.className}`;
    pacerText.innerHTML = current.text.replace('\n', '<br/>');

    pacerTimer = setTimeout(() => {
      step = (step + 1) % sequence.length;
      runStep();
    }, current.duration);
  }

  function startPacer() {
    isPacing = true;
    step = 0;
    toggleBtn.textContent = '호흡 멈추기';
    toggleBtn.style.background = '#e53e3e';
    runStep();
  }

  function stopPacer() {
    isPacing = false;
    clearTimeout(pacerTimer);
    pacerCircle.className = 'pacer-circle';
    pacerText.textContent = '두 번 들이마시기';
    toggleBtn.textContent = '호흡 가이드 시작';
    toggleBtn.style.background = '#38a169';
  }

  toggleBtn.addEventListener('click', () => {
    if (isPacing) {
      stopPacer();
    } else {
      startPacer();
    }
  });
}

/* ============================================================ */
/* 3. 자녀 구조 신호 디코더 행 클릭 시 하이라이트 인터랙션      */
/* ============================================================ */
function initDecoderInteraction() {
  const rows = document.querySelectorAll('.decoder-row.item-row');
  rows.forEach(row => {
    row.addEventListener('click', () => {
      rows.forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');

      // 연결된 원인 카드가 있다면 부드럽게 반짝임 효과
      const causeStr = row.querySelector('.badge-cause')?.textContent;
      if (causeStr) {
        const causeCards = document.querySelectorAll('.cause-card');
        causeCards.forEach(c => c.style.outline = 'none');
        if (causeStr.includes('1')) highlightCard('1');
        if (causeStr.includes('2')) highlightCard('2');
        if (causeStr.includes('3')) highlightCard('3');
      }
    });
  });

  function highlightCard(causeNum) {
    const target = document.querySelector(`.cause-card[data-cause="${causeNum}"]`);
    if (target) {
      target.style.outline = '3px solid #e53e3e';
      target.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        target.style.outline = 'none';
        target.style.transform = '';
      }, 1500);
    }
  }
}

/* ============================================================ */
/* 4. 신경호르몬 4대 프로토콜 탭 전환                          */
/* ============================================================ */
function initHormoneTabs() {
  const tabBtns = document.querySelectorAll('.hormone-tab-btn');
  const panels = document.querySelectorAll('.hormone-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`panel-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ============================================================ */
/* 5. 일일 체크리스트 로컬 저장 및 진행률 계산                 */
/* ============================================================ */
function initChecklist() {
  const checkboxes = document.querySelectorAll('.custom-chk');
  const progressFill = document.getElementById('progress-fill');
  const progressPercent = document.getElementById('progress-percent');
  const STORAGE_KEY = 'neuro_social_daily_checklist_v1';

  // 저장된 체크박스 상태 로드
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  checkboxes.forEach(chk => {
    if (savedState[chk.id]) {
      chk.checked = true;
    }
  });

  function updateProgress() {
    const total = checkboxes.length;
    let checkedCount = 0;
    const currentState = {};

    checkboxes.forEach(chk => {
      if (chk.checked) checkedCount++;
      currentState[chk.id] = chk.checked;
    });

    const percent = Math.round((checkedCount / total) * 100);
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressPercent) progressPercent.textContent = `${percent}%`;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  }

  checkboxes.forEach(chk => {
    chk.addEventListener('change', updateProgress);
  });

  updateProgress();
}
