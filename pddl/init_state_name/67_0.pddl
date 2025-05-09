(define (problem scene1)
  (:domain manip)
  (:objects
    black tape - item
    black pen - item
    glue stick - item
    blue marker - item
    green marker - item
    tweezers - item
    big yellow shopping basket - container
    big green shopping basket - container
  )
  (:init
    (ontable black tape)
    (ontable black pen)
    (ontable glue stick)
    (ontable blue marker)
    (ontable tweezers)
    (in green marker big yellow shopping basket)
    (clear black tape)
    (clear black pen)
    (clear glue stick)
    (clear blue marker)
    (clear tweezers)
    (clear green marker)
    (clear big yellow shopping basket)
    (clear big green shopping basket)
    (handempty)
  )
  (:goal (and ))
)