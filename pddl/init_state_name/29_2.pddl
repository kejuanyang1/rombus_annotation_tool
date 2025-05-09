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
    (in blue marker yellow basket)
    (ontable yellow basket)
    (ontable green basket)
    (clear white tape)
    (clear green basket)
    (not (closed yellow basket))
    (handempty)
  )
  (:goal (and ))
)