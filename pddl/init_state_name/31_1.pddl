(define (problem scene1)
  (:domain manip)
  (:objects
    white tape - item
    black pen - item
    paper clip - item
    stapler - item
    yellow basket - container
  )
  (:init
    (ontable black pen)
    (ontable stapler)
    (ontable paper clip)
    (in white tape yellow basket)
    (clear black pen)
    (clear stapler)
    (clear paper clip)
    (handempty)
  )
  (:goal (and ))
)