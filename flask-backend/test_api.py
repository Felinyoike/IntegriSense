import requests
import json
import time

# Test the Flask backend API endpoints
BASE_URL = "http://localhost:8080"

def test_health_endpoint():
    """Test the health check endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_sensor_data_endpoint():
    """Test the sensor data endpoint with sample ESP32 data"""
    print("\n🔍 Testing sensor data endpoint...")
    
    # Sample ESP32 sensor data
    sample_data = {
        "bvp": 0.85,
        "hrv": 45.2,
        "temperature": 36.5,
        "eda": 0.012,
        "acceleration": {
            "x": 0.02,
            "y": -0.01,
            "z": 0.98
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/sensor-data",
            json=sample_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Sensor data test failed: {e}")
        return False

def test_multiple_sensor_readings():
    """Test multiple sensor readings to simulate real ESP32 data stream"""
    print("\n🔍 Testing multiple sensor readings...")
    
    test_readings = [
        {
            "bvp": 0.82,
            "hrv": 44.8,
            "temperature": 36.3,
            "eda": 0.015,
            "acceleration": {"x": 0.01, "y": -0.02, "z": 0.99}
        },
        {
            "bvp": 0.88,
            "hrv": 46.1,
            "temperature": 36.7,
            "eda": 0.018,
            "acceleration": {"x": 0.03, "y": 0.01, "z": 0.97}
        },
        {
            "bvp": 0.79,
            "hrv": 43.5,
            "temperature": 36.2,
            "eda": 0.022,
            "acceleration": {"x": -0.01, "y": 0.02, "z": 0.98}
        }
    ]
    
    success_count = 0
    for i, reading in enumerate(test_readings):
        try:
            response = requests.post(
                f"{BASE_URL}/api/sensor-data",
                json=reading,
                headers={'Content-Type': 'application/json'}
            )
            if response.status_code == 200:
                success_count += 1
                print(f"✅ Reading {i+1}: Success")
            else:
                print(f"❌ Reading {i+1}: Failed with status {response.status_code}")
            
            time.sleep(0.5)  # Small delay between readings
            
        except Exception as e:
            print(f"❌ Reading {i+1}: Error - {e}")
    
    print(f"📊 Results: {success_count}/{len(test_readings)} readings successful")
    return success_count == len(test_readings)

if __name__ == "__main__":
    print("🚀 Starting Flask Backend API Tests")
    print("=" * 50)
    
    # Run tests
    health_ok = test_health_endpoint()
    sensor_ok = test_sensor_data_endpoint()
    multiple_ok = test_multiple_sensor_readings()
    
    print("\n" + "=" * 50)
    print("📋 Test Summary:")
    print(f"Health Endpoint: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"Sensor Data Endpoint: {'✅ PASS' if sensor_ok else '❌ FAIL'}")
    print(f"Multiple Readings: {'✅ PASS' if multiple_ok else '❌ FAIL'}")
    
    if all([health_ok, sensor_ok, multiple_ok]):
        print("\n🎉 All tests passed! Flask backend is working correctly.")
    else:
        print("\n⚠️ Some tests failed. Check the backend logs for more details.")
