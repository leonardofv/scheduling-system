<?php

return [
     // Days after the origin consultation within which a follow-up must occur
    'follow_up_window_days' => (int) env('FOLLOW_UP_WINDOW_DAYS', 30),
];
