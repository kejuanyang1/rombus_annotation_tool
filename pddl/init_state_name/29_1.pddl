(define (problem scene)
  (:domain manip)
  (:objects
    white tape - item
    blue marker - item
    yellow basket - container
    green basket - container
  )
  (:init
    (in white tape yellow basket)
    (ontable blue marker)
    (ontable yellow basket)
    (ontable green basket)
    (clear blue marker)
    (handempty)
  )
  (:goal (and ))
)