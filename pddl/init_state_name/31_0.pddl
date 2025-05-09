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
    (ontable white tape)
    (ontable black pen)
    (ontable paper clip)
    (ontable stapler)
    (ontable yellow basket)
    (clear white tape)
    (clear black pen)
    (clear paper clip)
    (clear stapler)
    (clear yellow basket)
    (handempty)
  )
  (:goal (and ))
)