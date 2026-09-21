import os
import time
from playwright.sync_api import sync_playwright

def export_cards():
    out_dir = os.path.join(os.path.dirname(__file__), "kakao_cards")
    os.makedirs(out_dir, exist_ok=True)
    
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # 고해상도 1080 x 1350 뷰포트 설정
        page = browser.new_page(viewport={"width": 1200, "height": 1600}, device_scale_factor=1)
        
        # 로컬 서버의 card_news.html 로드
        url = "http://localhost:8099/card_news.html"
        print(f"카드뉴스 페이지 로딩 중: {url}")
        page.goto(url, wait_until="networkidle")
        time.sleep(1.5) # 폰트 렌더링 대기
        
        # 6개 카드 요소 각각 캡처
        card_names = [
            "card_01_표지_배터리인식전환.png",
            "card_02_원인_5가지생물학적병목.png",
            "card_03_신호_SOS구조신호번역기.png",
            "card_04_솔루션_실생활5대개입전략.png",
            "card_05_호르몬_운동영양식단프로토콜.png",
            "card_06_실천_시간표체크리스트와위로.png"
        ]
        
        for i in range(1, 7):
            card_id = f"#card-{i}"
            card_elem = page.locator(card_id)
            if card_elem.count() > 0:
                out_path = os.path.join(out_dir, card_names[i - 1])
                card_elem.screenshot(path=out_path)
                print(f"[완료] {card_names[i - 1]} 저장 완료 -> {out_path}")
            else:
                print(f"[경고] {card_id} 요소를 찾을 수 없습니다.")
                
        # 치트시트 PDF 생성
        print("치트시트 PDF 생성 중...")
        page_pdf = browser.new_page()
        page_pdf.goto("http://localhost:8099/index.html", wait_until="networkidle")
        time.sleep(1.0)
        pdf_path = os.path.join(out_dir, "우리_아이_사회성_뇌과학_가이드_A4치트시트.pdf")
        page_pdf.pdf(path=pdf_path, format="A4", print_background=True, margin={"top": "15mm", "bottom": "15mm", "left": "15mm", "right": "15mm"})
        print(f"[완료] PDF 저장 완료 -> {pdf_path}")
        
        browser.close()
        print("\n모든 카카오톡 공유용 자료 생성이 완료되었습니다!")

if __name__ == "__main__":
    export_cards()
