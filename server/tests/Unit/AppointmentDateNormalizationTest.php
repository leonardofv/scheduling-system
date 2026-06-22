<?php

namespace Tests\Unit;

use App\Models\Appointment;
use PHPUnit\Framework\TestCase;

class AppointmentDateNormalizationTest extends TestCase
{
    public function test_date_is_normalized_to_y_m_d(): void
    {
        $appointment = new Appointment();
        $appointment->date = '2026-06-25T00:00:00';

        $this->assertSame('2026-06-25', $appointment->date);
    }

    public function test_time_is_normalized_to_h_i_s(): void
    {
        $appointment = new Appointment();
        $appointment->time = '14:00';

        $this->assertSame('14:00:00', $appointment->time);
    }

    public function test_schedule_at_combines_date_and_time(): void
    {
        $appointment = new Appointment();
        $appointment->date = '2026-06-25';
        $appointment->time = '14:00';

        $this->assertSame('2026-06-25 14:00:00', $appointment->scheduleAt->format('Y-m-d H:i:s'));
    }
}
