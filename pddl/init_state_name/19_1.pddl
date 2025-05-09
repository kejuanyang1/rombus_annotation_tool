(define (problem scene1)
  (:domain manip)
  (:objects
    apple - item
    orange - item
    mango - item
    red chili pepper - item
    purple jello box - support
    blue bowl - container
    pink bowl - container
    blue lid - lid
    pink lid - lid
  )
  (:init
    (ontable apple)
    (ontable mango)
    (ontable red chili pepper)
    (ontable purple jello box)
    (ontable blue lid)
    (ontable pink bowl)
    (in orange blue bowl)
    (closed pink bowl)
    (handempty)
    (clear apple)
    (clear mango)
    (clear red chili pepper)
    (clear purple jello box)
    (clear blue lid)
    (clear blue bowl)
  )
  (:goal (and ))
)