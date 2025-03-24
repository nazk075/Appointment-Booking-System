from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from db_config import get_connection
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/slots', methods=['GET'])
def get_slots():
    date_str = request.args.get('date')
    selected_date = datetime.strptime(date_str, "%Y-%m-%d").date()

    start_time = datetime.strptime("10:00", "%H:%M")
    end_time = datetime.strptime("17:00", "%H:%M")
    break_start = datetime.strptime("13:00", "%H:%M")
    break_end = datetime.strptime("14:00", "%H:%M")

    slots = []
    while start_time < end_time:
        if not (break_start <= start_time < break_end):
            slots.append(start_time.strftime("%I:%M %p"))
        start_time += timedelta(minutes=30)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT time_slot FROM appointments WHERE date = %s", (selected_date,))
    booked_slots = [row[0] for row in cursor.fetchall()]
    conn.close()

    available = [s for s in slots if s not in booked_slots]
    return jsonify(available)

@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    data = request.json
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT * FROM appointments WHERE date = %s AND time_slot = %s",
            (data['date'], data['time_slot'])
        )
        if cursor.fetchone():
            return jsonify({"success": False, "message": "Time slot already booked!"})

        cursor.execute(
            "INSERT INTO appointments (name, phone, date, time_slot) VALUES (%s, %s, %s, %s)",
            (data['name'], data['phone'], data['date'], data['time_slot'])
        )
        conn.commit()
        return jsonify({"success": True, "message": "Appointment booked!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
    finally:
        conn.close()

@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM appointments ORDER BY date, time_slot")
    appointments = cursor.fetchall()
    conn.close()
    return jsonify(appointments)

@app.route('/api/appointments/<int:appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    data = request.json
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT * FROM appointments WHERE date = %s AND time_slot = %s AND id != %s",
            (data['date'], data['time_slot'], appointment_id)
        )
        if cursor.fetchone():
            return jsonify({"success": False, "message": "Time slot already booked by another appointment!"})

        cursor.execute("""
            UPDATE appointments SET name=%s, phone=%s, date=%s, time_slot=%s 
            WHERE id=%s
        """, (data['name'], data['phone'], data['date'], data['time_slot'], appointment_id))
        conn.commit()
        return jsonify({"success": True, "message": "Appointment updated!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
    finally:
        conn.close()

@app.route('/api/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM appointments WHERE id = %s", (appointment_id,))
        conn.commit()
        return jsonify({"success": True, "message": "Appointment deleted!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5002)
