(define (problem scene1)
  (:domain manip)
  (:objects
    white tape - item
    paper clip - item
    green marker - item
    screwdriver - item
  )
  (:init
    (ontable white tape)
    (ontable paper clip)
    (ontable green marker)
    (ontable screwdriver)
    (clear white tape)
    (clear paper clip)
    (clear green marker)
    (clear screwdriver)
    (handempty)
  )
  (:goal (and ))
)