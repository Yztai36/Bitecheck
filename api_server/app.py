# Model_Source/app.py
from flask_cors import CORS
from flask import Flask, request, jsonify
from PIL import Image
import torch
import torchvision.transforms as transforms
import google.generativeai as genai
import os
from datetime import datetime
import json
from flask import Flask

app = Flask(__name__)
CORS(app)
# Modeli yükle
model = torch.load('bitecheck_best.pt', map_location=torch.device('cpu'), weights_only=False)
model.eval()

# Preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),  
    transforms.ToTensor()
])


# Gemini API ayarları
os.environ["GOOGLE_API_KEY"] = "AIzaSyCbVycRj-6ZGmVVzOGo3I4IRWH6VLFNfMQ"  
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
gemini_model = genai.GenerativeModel('gemini-1.5-flash')

def get_gemini_recommendation(insect_name):
    """Gemini AI'dan böcek için güzel formatlı öneriler al"""
    prompt = f"""
    {insect_name} ısırığı için BITECHECK önerilerini güzel bir formatta ver.
    
    Lütfen şu formatı kullan:
    
    🔸 İLK YARDIM:
    • Öneri 1
    • Öneri 2
    
    🔸 TEDAVİ:
    • Öneri 1
    • Öneri 2
    
    🔸 DİKKAT EDİLMESİ GEREKENLER:
    • Uyarı 1
    • Uyarı 2
    
    🔸 DOKTOR NE ZAMAN GÖRÜLMELİ:
    • Durum 1
    • Durum 2
    
    Türkçe, kısa ve anlaşılır olsun. Her kategoride maksimum 2-3 öneri ver.
    """
    try:
        response = gemini_model.generate_content([prompt])
        return [response.text.strip()]
    except Exception as e:
        print(f"Gemini API hatası: {e}")
       
        return [
            f"""🔸 İLK YARDIM:
• Yarayı temiz su ile yıkayın
• Soğuk kompres uygulayın (10-15 dk)

🔸 TEDAVİ:
• Antihistaminik krem sürün
• Kaşımaktan kaçının

🔸 DİKKAT EDİLMESİ GEREKENLER:
• Kızarıklık artarsa doktora başvurun
• Enfeksiyon belirtilerini takip edin

🔸 DOKTOR NE ZAMAN GÖRÜLMELİ:
• Ateş, şişlik veya pus varsa
• 48 saat içinde iyileşme yoksa"""
        ]

def save_analysis_history(result_data):
    """Analiz sonucunu geçmişe kaydet"""
    try:
        # Zaman damgası ekle
        result_data['timestamp'] = datetime.now().isoformat()
        result_data['date'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Geçmiş dosyasını oku veya oluştur
        history_file = 'analysis_history.json'
        history = []
        
        try:
            with open(history_file, 'r', encoding='utf-8') as f:
                history = json.load(f)
        except FileNotFoundError:
            history = []
        
        # Yeni analizi ekle
        history.append(result_data)
        
        # Son 100 analizi tut
        if len(history) > 100:
            history = history[-100:]
        
        # Dosyaya kaydet
        with open(history_file, 'w', encoding='utf-8') as f:
            json.dump(history, f, ensure_ascii=False, indent=2)
        
        print(f"Analysis saved to history: {result_data['insect']} - {result_data['confidence']}%")
        
    except Exception as e:
        print(f"Error saving history: {e}")

def create_healing_case(base64_image, analysis_data):
    """İlk analiz fotoğrafından iyileşme takibi case'i oluştur"""
    try:
        case_id = f"case_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # İyileşme verisi hazırla
        healing_data = {
            'id': case_id,
            'title': f"{analysis_data['insect']} Isırığı",
            'startDate': datetime.now().strftime('%Y-%m-%d'),
            'insectType': analysis_data['insect'],
            'initialSeverity': min(int(analysis_data['confidence'] / 10), 10),
            'currentSeverity': min(int(analysis_data['confidence'] / 10), 10),
            'status': 'active',
            'lastUpdate': datetime.now().isoformat(),
            'photos': [{
                'id': f"photo_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                'date': datetime.now().strftime('%Y-%m-%d'),
                'time': datetime.now().strftime('%H:%M'),
                'imageBase64': base64_image,
                'severity': min(int(analysis_data['confidence'] / 10), 10),
                'symptoms': analysis_data.get('recommendations', [])[:3],
                'notes': f"İlk analiz - {analysis_data['insect']} tespiti",
                'aiAnalysis': {
                    'healing': 'stable',
                    'confidence': analysis_data['confidence'],
                    'recommendations': analysis_data['recommendations'],
                    'urgency': 'medium' if analysis_data['confidence'] > 80 else 'low'
                }
            }]
        }
        
        # Healing cases dosyasına kaydet
        healing_file = 'healing_cases.json'
        cases = []
        
        try:
            with open(healing_file, 'r', encoding='utf-8') as f:
                cases = json.load(f)
        except FileNotFoundError:
            cases = []
        
        cases.append(healing_data)
        
        # En son 50 case'i tut
        if len(cases) > 50:
            cases = cases[-50:]
        
        with open(healing_file, 'w', encoding='utf-8') as f:
            json.dump(cases, f, ensure_ascii=False, indent=2)
        
        print(f"Healing case created: {case_id}")
        return case_id
        
    except Exception as e:
        print(f"Error creating healing case: {e}")
        return None

def add_photo_to_case(case_id, base64_image, analysis):
    """Mevcut case'e yeni fotoğraf ekle"""
    try:
        healing_file = 'healing_cases.json'
        
        with open(healing_file, 'r', encoding='utf-8') as f:
            cases = json.load(f)
        
        # Case'i bul
        case_found = False
        for case in cases:
            if case['id'] == case_id:
                case_found = True
                
                # Yeni fotoğraf oluştur
                new_photo = {
                    'id': f"photo_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                    'date': datetime.now().strftime('%Y-%m-%d'),
                    'time': datetime.now().strftime('%H:%M'),
                    'imageBase64': base64_image,
                    'severity': analysis.get('severity_score', 5),
                    'symptoms': analysis.get('visible_symptoms', []),
                    'notes': f"İyileşme takibi - {analysis.get('description', '')}",
                    'aiAnalysis': {
                        'healing': analysis.get('healing', 'stable'),
                        'confidence': analysis.get('confidence', 70),
                        'recommendations': analysis.get('recommendations', []),
                        'urgency': analysis.get('urgency', 'low')
                    }
                }
                
                # Fotoğrafı ekle
                case['photos'].append(new_photo)
                case['currentSeverity'] = analysis.get('severity_score', case['currentSeverity'])
                case['lastUpdate'] = datetime.now().isoformat()
                
                # İyileşme durumuna göre status güncelle
                if analysis.get('urgency') == 'emergency':
                    case['status'] = 'needs_attention'
                elif analysis.get('healing') == 'improving':
                    case['status'] = 'active'
                elif analysis.get('healing') == 'worsening':
                    case['status'] = 'needs_attention'
                
                break
        
        if not case_found:
            print(f"Case not found: {case_id}")
            return False
        
        # Dosyayı güncelle
        with open(healing_file, 'w', encoding='utf-8') as f:
            json.dump(cases, f, ensure_ascii=False, indent=2)
        
        print(f"Photo added to case: {case_id}")
        return True
        
    except Exception as e:
        print(f"Error adding photo to case: {e}")
        return False

@app.route('/history', methods=['GET'])
def get_history():
    """Analiz geçmişini getir"""
    try:
        with open('analysis_history.json', 'r', encoding='utf-8') as f:
            history = json.load(f)
        # Son analizler önce gelsin
        history.reverse()
        return jsonify({'history': history}), 200
    except FileNotFoundError:
        return jsonify({'history': []}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/healing-cases', methods=['GET'])
def get_healing_cases():
    """İyileşme takip case'lerini getir"""
    try:
        with open('healing_cases.json', 'r', encoding='utf-8') as f:
            cases = json.load(f)
        cases.reverse() # Son case'ler önce gelsin
        return jsonify({'cases': cases}), 200
    except FileNotFoundError:
        return jsonify({'cases': []}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/location-insects', methods=['POST'])
def get_location_insects():
    """Konuma göre böcek aktivite bilgilerini getir"""
    try:
        data = request.get_json()
        location = data.get('location', 'Türkiye')
        season = data.get('season', 'Yaz')
        current_month = data.get('currentMonth', 8)
        
        print(f"Location insects request for: {location}, {season}")
        
        # Gemini'den konum-bazlı böcek analizi al
        prompt = f"""
        {location} bölgesinde {season} mevsiminde (şu anki ay: {current_month}) aktif olan böcekler hakkında detaylı bilgi ver.
        
        Aşağıdaki JSON formatında cevap ver:
        {{
            "insects": [
                {{
                    "name": "böcek ismi",
                    "risk": "Düşük/Orta/Yüksek",
                    "prevalence": yaygınlık_yüzdesi (0-100 arası),
                    "season": "aktif olduğu mevsim",
                    "symptoms": ["belirti1", "belirti2"],
                    "description": "kısa açıklama",
                    "preventionTips": ["koruyucu tedbir1", "koruyucu tedbir2"],
                    "activities": ["şu anda aktif durumda olduğu aktivite"]
                }}
            ]
        }}
        
        En az 4-5 böcek türü için bilgi ver. Türkiye'deki gerçek böcek türlerini kullan.
        Sadece JSON formatında cevap ver, başka açıklama ekleme.
        """
        
        try:
            response = gemini_model.generate_content([prompt])
            
            # JSON'u parse et
            import json
            import re
            
            # JSON kısmını ayıkla
            response_text = response.text.strip()
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            
            if json_match:
                json_str = json_match.group(0)
                insects_data = json.loads(json_str)
                return jsonify(insects_data), 200
            else:
                raise ValueError("JSON formatı bulunamadı")
                
        except Exception as e:
            print(f"Gemini API hatası: {e}")
            # Hata durumunda varsayılan veriyi döndür
            default_insects = {
                "insects": [
                    {
                        "name": "Sivrisinek",
                        "risk": "Orta",
                        "prevalence": 85,
                        "season": "Yaz-Sonbahar",
                        "symptoms": ["Kaşıntı", "Kızarıklık", "Şişlik"],
                        "description": f"{location} bölgesinde su birikintilerinde yaygın",
                        "preventionTips": ["Kovucu kullanın", "Açık alanları kapatın", "Su birikintilerini temizleyin"],
                        "activities": ["Akşam saatlerinde aktif", "Su kaynaklarının yakınında"]
                    },
                    {
                        "name": "Kene",
                        "risk": "Yüksek", 
                        "prevalence": 45,
                        "season": "İlkbahar-Yaz",
                        "symptoms": ["Ateş", "Baş ağrısı", "Kas ağrısı"],
                        "description": f"{location} çevresindeki ormanlık alanlarda",
                        "preventionTips": ["Uzun kıyafet giyin", "Kovucu kullanın", "Vücut kontrolü yapın"],
                        "activities": ["Çalılık alanlarda", "Yüksek otlarda bekliyor"]
                    },
                    {
                        "name": "Arı",
                        "risk": "Orta",
                        "prevalence": 65,
                        "season": "İlkbahar-Yaz", 
                        "symptoms": ["Ağrı", "Şişlik", "Alerjik reaksiyon"],
                        "description": f"{location} bölgesindeki çiçekli alanlar",
                        "preventionTips": ["Parlak renklerden kaçının", "Parfüm kullanmayın", "Yavaş hareket edin"],
                        "activities": ["Çiçek polen topluyor", "Meyve ağaçlarında aktif"]
                    }
                ]
            }
            return jsonify(default_insects), 200
            
    except Exception as e:
        print(f"Location insects error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/analyze-healing', methods=['POST'])
def analyze_healing():
    """İyileşme fotoğrafını analiz et"""
    try:
        data = request.get_json()
        base64_image = data.get('image')
        case_id = data.get('caseId')
        timestamp = data.get('timestamp')
        
        if not base64_image:
            return jsonify({'error': 'No image provided'}), 400
        
        print(f"Healing analysis request for case: {case_id}")
        
        # Gemini ile iyileşme analizi
        prompt = f"""
        Bu görüntü bir böcek ısırığı veya yarasının iyileşme sürecini takip etmek için çekilmiş.
        
        Lütfen bu yaranın/ısırığın durumunu analiz et ve aşağıdaki JSON formatında cevap ver:
        {{
            "analysis": {{
                "healing": "improving/stable/worsening",
                "confidence": güven_yüzdesi (0-100),
                "severity_score": ciddiyet_puanı (1-10),
                "visible_symptoms": ["görünen belirti1", "belirti2"],
                "recommendations": [
                    "öneri1",
                    "öneri2", 
                    "öneri3"
                ],
                "urgency": "low/medium/high/emergency",
                "next_checkup": "kaç gün sonra kontrol edilmeli",
                "description": "yaranın genel durumu hakkında açıklama"
            }}
        }}
        
        Dikkat edilmesi gerekenler:
        - İyileşme durumunu objektif olarak değerlendir
        - Enfeksiyon belirtilerine dikkat et (kızarıklık, şişlik, iltihap)
        - Acil durum gerektiren durumları tespit et
        - Praktik ve uygulanabilir öneriler ver
        - Türkçe cevap ver
        
        Sadece JSON formatında cevap ver, başka açıklama ekleme.
        """
        
        try:
            # Base64 image'ı decode et
            import base64
            from io import BytesIO
            
            image_data = base64.b64decode(base64_image)
            img = Image.open(BytesIO(image_data)).convert('RGB')
            
            # Gemini'ye resim ve prompt gönder
            response = gemini_model.generate_content([prompt, img])
            
            # JSON'u parse et
            import json
            import re
            
            response_text = response.text.strip()
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            
            if json_match:
                json_str = json_match.group(0)
                healing_data = json.loads(json_str)
                
                # Mevcut case'e yeni fotoğraf ekle
                if case_id:
                    add_photo_to_case(case_id, base64_image, healing_data['analysis'])
                
                return jsonify(healing_data), 200
            else:
                raise ValueError("JSON formatı bulunamadı")
                
        except Exception as e:
            print(f"Gemini healing analysis error: {e}")
            # Hata durumunda varsayılan analiz
            default_analysis = {
                "analysis": {
                    "healing": "stable",
                    "confidence": 70,
                    "severity_score": 5,
                    "visible_symptoms": ["Hafif kızarıklık", "Küçük şişlik"],
                    "recommendations": [
                        "Yarayı temiz ve kuru tutun",
                        "Günde 2 kez antiseptik uygulayın", 
                        "Kaşımaktan kaçının",
                        "48 saat içinde iyileşme yoksa doktora başvurun"
                    ],
                    "urgency": "low",
                    "next_checkup": "2-3 gün",
                    "description": "Yara normal iyileşme sürecinde görünüyor. Takip edilmeli."
                }
            }
            return jsonify(default_analysis), 200
            
    except Exception as e:
        print(f"Healing analysis error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    print("POST request received!") # Debug log
    
    # JSON formatında base64 image kabul et
    data = request.get_json()
    if not data or 'image' not in data:
        print("No base64 image in request") # Debug log
        return jsonify({'error': 'No base64 image provided'}), 400
    
    try:
        import base64
        from io import BytesIO
        
        # Base64'ü decode et
        base64_image = data['image']
        image_data = base64.b64decode(base64_image)
        img = Image.open(BytesIO(image_data)).convert('RGB')
        print("Image successfully decoded from base64") # Debug log
    except Exception as e:
        print(f"Error decoding base64 image: {e}") # Debug log
        return jsonify({'error': 'Invalid base64 image'}), 400
    img = transform(img).unsqueeze(0)  # [1, C, H, W]
    with torch.no_grad():
        output = model(img)
        probabilities = torch.nn.functional.softmax(output, dim=1)[0]
        pred = probabilities.argmax().item()
        confidence = float(probabilities[pred]) * 100
        class_names = ['ants','bed_bugs','bee','chigger','fleas','mosquitos','no_bites','spider','ticks']  # Kendi datasetine göre güncelle
        
        # Türkçe çeviri sözlüğü
        turkish_translations = {
            'ants': 'Karınca',
            'bed_bugs': 'Yatak Böceği', 
            'bee': 'Arı',
            'chigger': 'Harvest Akarı',
            'fleas': 'Pire',
            'mosquitos': 'Sivrisinek',
            'no_bites': 'Böcek Isırığı Yok',
            'spider': 'Örümcek',
            'ticks': 'Kene'
        }
        
        insect_english = class_names[pred]
        insect = turkish_translations.get(insect_english, insect_english)
        
        # Gemini'den dinamik öneriler al
        print(f"Getting recommendations for {insect} from Gemini...")
        recommendations = get_gemini_recommendation(insect)
    
    response_data = {
        'class': pred,
        'insect': insect,
        'confidence': round(confidence, 2),
        'recommendations': recommendations
    }
    
    # Analizi geçmişe kaydet
    save_analysis_history(response_data.copy())
    
    # İyileşme takibi için case oluştur
    healing_case_id = create_healing_case(base64_image, response_data)
    response_data['healing_case_id'] = healing_case_id
    
    print(f"Sending response: {response_data}") # Debug log
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)