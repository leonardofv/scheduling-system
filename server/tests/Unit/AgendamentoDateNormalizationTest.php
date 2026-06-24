<?php

namespace Tests\Unit;

use App\Models\Agendamento;
use PHPUnit\Framework\TestCase;

class AgendamentoDateNormalizationTest extends TestCase
{
    public function test_date_is_normalized_to_y_m_d(): void
    {
        $agendamento = new Agendamento();
        $agendamento->date = '2026-06-25T00:00:00';

        $this->assertSame('2026-06-25', $agendamento->date);
    }

    public function test_time_is_normalized_to_h_i_s(): void
    {
        $agendamento = new Agendamento();
        $agendamento->time = '14:00';

        $this->assertSame('14:00:00', $agendamento->time);
    }

    public function test_schedule_at_combines_date_and_time(): void
    {
        $agendamento = new Agendamento();
        $agendamento->date = '2026-06-25';
        $agendamento->time = '14:00';

        $this->assertSame('2026-06-25 14:00:00', $agendamento->scheduleAt->format('Y-m-d H:i:s'));
    }
}
