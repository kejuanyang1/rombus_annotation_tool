(define (problem scene1)
  (:domain manip)
  (:objects
    white tape - item
    blue marker - item
    yellow basket - container
    green basket - container
  )
  (:init
    (ontable white tape)
    (ontable blue marker)
    (ontable yellow basket)
    (ontable green basket)
    (clear white tape)
    (clear blue marker)
    (clear yellow basket)
    (clear green basket)
    (handempty)
  )
  (:goal (and ))
)