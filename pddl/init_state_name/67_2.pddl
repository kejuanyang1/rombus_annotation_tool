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
    (ontable blue marker)
    (ontable glue stick)
    (ontable black pen)
    (ontable black tape)
    (in tweezers big green shopping basket)
    (in green marker big yellow shopping basket)
    (closed big yellow shopping basket)
    (closed big green shopping basket)
    (handempty)
    (clear blue marker)
    (clear glue stick)
    (clear black pen)
    (clear black tape)
  )
  (:goal (and ))
)