(define (problem scene1)
  (:domain manip)
  (:objects
    red chili pepper - item
    purple jello box - support
    yellow jello box - support
    white tape - item
    big yellow shopping basket - container
    blue basket - container
  )
  (:init
    (ontable purple jello box)
    (ontable yellow jello box)
    (ontable white tape)
    (in red chili pepper big yellow shopping basket)
    (ontable big yellow shopping basket)
    (ontable blue basket)
    (clear purple jello box)
    (clear yellow jello box)
    (clear white tape)
    (clear blue basket)
    (handempty)
  )
  (:goal (and ))
)