(define (problem scene1)
  (:domain manip)
  (:objects
    white tape - item
    paper clip - item
    green marker - item
    yellow basket - container
  )
  (:init
    (ontable white tape)
    (ontable paper clip)
    (ontable green marker)
    (ontable yellow basket)
    (clear white tape)
    (clear paper clip)
    (clear green marker)
    (clear yellow basket)
    (handempty)
  )
  (:goal (and ))
)