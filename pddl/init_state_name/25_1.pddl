(define (problem scene1)
  (:domain manip)
  (:objects
    white tape - item
    paper clip - item
    green marker - item
    yellow basket - container
  )
  (:init
    (in white tape yellow basket)
    (ontable paper clip)
    (ontable green marker)
    (closed yellow basket)
    (clear paper clip)
    (clear green marker)
    (handempty)
  )
  (:goal (and ))
)