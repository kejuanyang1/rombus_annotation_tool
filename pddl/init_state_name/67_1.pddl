(define (problem scene)
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
    (ontable green marker)
    (ontable tweezers)
    (ontable black pen)
    (in black tape big yellow shopping basket)
    (in glue stick big yellow shopping basket)
    (in blue marker big green shopping basket)
    (handempty)
    (clear green marker)
    (clear tweezers)
    (clear black pen)
  )
  (:goal (and))
)