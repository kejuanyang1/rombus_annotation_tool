(define (problem scene1)
  (:domain manip)
  (:objects
    black tape - item
    pencil - item
    black pen - item
    green marker - item
    stapler - item
    pink basket - container
  )
  (:init
    (ontable pencil)
    (ontable black pen)
    (ontable green marker)
    (ontable stapler)
    (in black tape pink basket)
    (closed pink basket)
    (clear pencil)
    (clear black pen)
    (clear green marker)
    (clear stapler)
    (clear pink basket)
    (handempty)
  )
  (:goal (and ))
)